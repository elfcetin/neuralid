package neuralid.backend.api;

import java.time.OffsetDateTime;
import java.util.UUID;

public record StartSessionResponse(
        UUID sessionID,
        OffsetDateTime startedAt
) {
}