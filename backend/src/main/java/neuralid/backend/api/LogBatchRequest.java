package neuralid.backend.api;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;
import java.util.UUID;

public record LogBatchRequest(
        @NotNull UUID sessionID,
        @NotEmpty @Size(max = 500) List<@Valid LogEventRequest> events
) {
}