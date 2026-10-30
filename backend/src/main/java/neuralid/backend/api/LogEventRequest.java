package neuralid.backend.api;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import neuralid.backend.db.EventType;

public record LogEventRequest(
        @NotNull EventType eventType,
        @NotNull Long timestamp,
        String value,
        @NotNull @Min(0) Integer sequenceNo
) {
}