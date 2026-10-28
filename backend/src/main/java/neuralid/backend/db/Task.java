package neuralid.backend.db;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "task")
public class Task {

    @Id
    @Column(name = "task_id")
    private UUID taskId;

    @Enumerated(EnumType.STRING)
    @Column(name = "task_type", nullable = false)
    private TaskType taskType;

    @Column(nullable = false)
    private int difficulty;

    @Column(nullable = false)
    private String content;

    @Column(name = "correct_answer", nullable = false)
    private String correctAnswer;

    protected Task() {
        // JPA için gerekli boş constructor
    }

    public UUID getTaskId() { return taskId; }
    public TaskType getTaskType() { return taskType; }
    public int getDifficulty() { return difficulty; }
    public String getContent() { return content; }
    public String getCorrectAnswer() { return correctAnswer; }
}