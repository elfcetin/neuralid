package neuralid.backend.api;

import jakarta.validation.Valid;
import neuralid.backend.db.NewInteractionEvent;
import neuralid.backend.service.LogIngestionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/logs")
public class LogController {

    private final LogIngestionService logIngestionService;

    public LogController(LogIngestionService logIngestionService) {
        this.logIngestionService = logIngestionService;
    }

    @PostMapping("/sync")
    public ResponseEntity<Void> syncLogs(@Valid @RequestBody LogBatchRequest request) {
        List<NewInteractionEvent> events = request.events().stream()
                .map(e -> new NewInteractionEvent(e.eventType(), e.timestamp(), e.value(), e.sequenceNo()))
                .toList();

        logIngestionService.ingest(request.sessionID(), events);

        return ResponseEntity.accepted().build();
    }
}