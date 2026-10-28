package neuralid.backend.service;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class InvalidSessionRequestException extends RuntimeException {
    public InvalidSessionRequestException(String message) {
        super(message);
    }
}