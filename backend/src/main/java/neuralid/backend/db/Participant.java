package neuralid.backend.db;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "participant")
public class Participant {

    @Id
    @Column(name = "participant_id")
    private UUID participantId;

    @Column(name = "consent_given", nullable = false)
    private boolean consentGiven;

    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt;

    protected Participant() {
        // JPA için gerekli boş constructor
    }

    public Participant(UUID participantId, boolean consentGiven) {
        this.participantId = participantId;
        this.consentGiven = consentGiven;
        this.createdAt = OffsetDateTime.now();
    }

    public UUID getParticipantId() { return participantId; }
    public boolean isConsentGiven() { return consentGiven; }
    public OffsetDateTime getCreatedAt() { return createdAt; }
}