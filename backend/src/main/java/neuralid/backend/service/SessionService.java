package neuralid.backend.service;

import neuralid.backend.db.Participant;
import neuralid.backend.db.ParticipantRepository;
import neuralid.backend.db.SessionStatus;
import neuralid.backend.db.Task;
import neuralid.backend.db.TaskRepository;
import neuralid.backend.db.TaskSession;
import neuralid.backend.db.TaskSessionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.UUID;

@Service
public class SessionService {

    private final TaskRepository taskRepository;
    private final ParticipantRepository participantRepository;
    private final TaskSessionRepository taskSessionRepository;

    public SessionService(TaskRepository taskRepository,
                          ParticipantRepository participantRepository,
                          TaskSessionRepository taskSessionRepository) {
        this.taskRepository = taskRepository;
        this.participantRepository = participantRepository;
        this.taskSessionRepository = taskSessionRepository;
    }

    @Transactional
    public TaskSession startSession(UUID userId, UUID taskId, Boolean consentGiven) {
        // 1. İstek kontrolü (DB'ye gitmeden önce)
        if (userId == null || taskId == null) {
            throw new InvalidSessionRequestException("userID and taskID are required");
        }
        if (!Boolean.TRUE.equals(consentGiven)) {
            throw new InvalidSessionRequestException("consentGiven must be true");
        }

        // 2. Görev var mı? Yoksa 404
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new TaskNotFoundException(taskId));

        // 3. Katılımcı varsa onu kullan, yoksa oluştur
        Participant participant = participantRepository.findById(userId)
                .orElseGet(() -> participantRepository.save(new Participant(userId, true)));

        // 4. Yeni oturumu STARTED olarak aç ve kaydet
        return taskSessionRepository.save(new TaskSession(participant, task));
    }

    @Transactional
    public void submitAnswer(UUID sessionId, String answer) {
        // 1. Oturum var mı? Yoksa 404
        TaskSession session = taskSessionRepository.findByIdForUpdate(sessionId)
                .orElseThrow(() -> new SessionNotFoundException(sessionId));

        // 2. Sadece açık (STARTED) oturuma cevap verilebilir, değilse 409
        if (session.getStatus() != SessionStatus.STARTED) {
            throw new SessionNotActiveException(sessionId, session.getStatus());
        }

        // 3. Cevabı değerlendir (boşluk ve büyük/küçük harf önemsiz)
        boolean correct = answer.trim().equalsIgnoreCase(session.getTask().getCorrectAnswer().trim());

        // 4. Oturumu kapat; transaction sonunda JPA dirty checking ile güncellenir
        session.setFinalAnswer(answer);
        session.setCorrect(correct);
        session.setSubmittedAt(OffsetDateTime.now());
        session.setStatus(SessionStatus.SUBMITTED);

        // TODO: triggerExtraction(sessionId) — @Async feature extraction (LLD) henüz yok
    }
}