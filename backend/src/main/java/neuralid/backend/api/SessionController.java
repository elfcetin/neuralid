package neuralid.backend.api;

import neuralid.backend.db.TaskSession;
import neuralid.backend.service.SessionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;

@RestController
@RequestMapping("/api/v1/sessions")
public class SessionController {

    private final SessionService sessionService;

    public SessionController(SessionService sessionService) {
        this.sessionService = sessionService;
    }

    @PostMapping("/start")
    public ResponseEntity<StartSessionResponse> startSession(@RequestBody StartSessionRequest request) {
        TaskSession session = sessionService.startSession(
                request.userID(),
                request.taskID(),
                request.consentGiven()
        );

        StartSessionResponse body = new StartSessionResponse(
                session.getSessionId(),
                session.getStartedAt()
        );

        return ResponseEntity
                .created(URI.create("/api/v1/sessions/" + session.getSessionId()))
                .body(body);
    }
}