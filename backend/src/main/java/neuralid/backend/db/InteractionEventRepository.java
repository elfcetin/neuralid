package neuralid.backend.db;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public class InteractionEventRepository {

    private static final String INSERT_SQL = """
            INSERT INTO interaction_event (session_id, event_type, event_timestamp, value, sequence_no)
            VALUES (?, ?, ?, ?, ?)
            ON CONFLICT (session_id, sequence_no) DO NOTHING
            """;

    private final JdbcTemplate jdbcTemplate;

    public InteractionEventRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public void insertIgnoringDuplicates(UUID sessionId, List<NewInteractionEvent> events) {
        jdbcTemplate.batchUpdate(INSERT_SQL, events, events.size(), (ps, event) -> {
            ps.setObject(1, sessionId);
            ps.setString(2, event.eventType().name());
            ps.setLong(3, event.timestamp());
            ps.setString(4, event.value());
            ps.setInt(5, event.sequenceNo());
        });
    }
}