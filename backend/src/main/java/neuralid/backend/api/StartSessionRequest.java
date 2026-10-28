package neuralid.backend.api;

import java.util.UUID;

public record StartSessionRequest(
        UUID userID,
        UUID taskID,
        Boolean consentGiven
) {
}