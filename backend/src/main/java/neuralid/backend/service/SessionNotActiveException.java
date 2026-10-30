package neuralid.backend.service;

import neuralid.backend.db.SessionStatus;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;
import java.util.UUID;

@ResponseStatus(HttpStatus.CONFLICT)
public class SessionNotActiveException extends RuntimeException {
    public SessionNotActiveException(UUID sessionId, SessionStatus status) {
        super("Session " + sessionId + " is not STARTED (current status: " + status + ")");
    }
}
