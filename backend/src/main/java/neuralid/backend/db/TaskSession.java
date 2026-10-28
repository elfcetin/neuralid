package neuralid.backend.db;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "task_session")
public class TaskSession {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "session_id")
    private UUID sessionId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "participant_id", nullable = false)
    private Participant participant;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "task_id", nullable = false)
    private Task task;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private SessionStatus status;

    @Column(name = "final_answer")
    private String finalAnswer;

    @Column(name = "is_correct")
    private Boolean correct;

    @Column(name = "started_at", nullable = false)
    private OffsetDateTime startedAt;

    @Column(name = "submitted_at")
    private OffsetDateTime submittedAt;

    protected TaskSession() {
        // JPA için gerekli boş constructor
    }

    public TaskSession(Participant participant, Task task) {
        this.participant = participant;
        this.task = task;
        this.status = SessionStatus.STARTED;
        this.startedAt = OffsetDateTime.now();
    }

    public UUID getSessionId() { return sessionId; }
    public Participant getParticipant() { return participant; }
    public Task getTask() { return task; }
    public SessionStatus getStatus() { return status; }
    public String getFinalAnswer() { return finalAnswer; }
    public Boolean getCorrect() { return correct; }
    public OffsetDateTime getStartedAt() { return startedAt; }
    public OffsetDateTime getSubmittedAt() { return submittedAt; }
}