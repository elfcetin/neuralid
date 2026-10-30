package neuralid.backend.db;

public record NewInteractionEvent(
        EventType eventType,
        long timestamp,
        String value,
        int sequenceNo
) {
}