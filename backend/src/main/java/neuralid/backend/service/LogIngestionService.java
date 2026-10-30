package neuralid.backend.service;

import neuralid.backend.db.InteractionEventRepository;
import neuralid.backend.db.NewInteractionEvent;
import neuralid.backend.db.SessionStatus;
import neuralid.backend.db.TaskSession;
import neuralid.backend.db.TaskSessionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class LogIngestionService {

    private final TaskSessionRepository taskSessionRepository;
    private final InteractionEventRepository interactionEventRepository;

    public LogIngestionService(TaskSessionRepository taskSessionRepository,
                               InteractionEventRepository interactionEventRepository) {
        this.taskSessionRepository = taskSessionRepository;
        this.interactionEventRepository = interactionEventRepository;
    }

    @Transactional
    public void ingest(UUID sessionId, List<NewInteractionEvent> events) {
        // 1. Session var mı? Yoksa 404
        TaskSession session = taskSessionRepository.findById(sessionId)
                .orElseThrow(() -> new SessionNotFoundException(sessionId));

        // 2. Session hâlâ açık mı? Değilse 409
        if (session.getStatus() != SessionStatus.STARTED) {
            throw new SessionNotActiveException(sessionId, session.getStatus());
        }

        // 3. Olayları toplu kaydet, tekrar gelen sequenceNo'ları atla
        interactionEventRepository.insertIgnoringDuplicates(sessionId, events);
    }
}