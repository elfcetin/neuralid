package neuralid.backend.api;

import neuralid.backend.db.Task;
import neuralid.backend.db.TaskType;
import java.util.UUID;

public record TaskResponse(UUID taskId, TaskType taskType, int difficulty, String content) {

    public static TaskResponse from(Task task) {
        return new TaskResponse(
                task.getTaskId(),
                task.getTaskType(),
                task.getDifficulty(),
                task.getContent()
        );
    }
}