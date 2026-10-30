package neuralid.backend.api;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record SubmitAnswerRequest(
        @NotNull UUID sessionID,
        @NotBlank String finalAnswer
) {
}
