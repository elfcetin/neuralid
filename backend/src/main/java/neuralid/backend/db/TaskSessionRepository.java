package neuralid.backend.db;

import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.UUID;

public interface TaskSessionRepository extends JpaRepository<TaskSession, UUID> {

    // Satırı kilitleyerek okur: aynı oturuma eşzamanlı iki submit gelirse ikincisi
    // birincinin bitmesini bekler ve status'u SUBMITTED görür (409).
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select s from TaskSession s join fetch s.task where s.sessionId = :sessionId")
    Optional<TaskSession> findByIdForUpdate(@Param("sessionId") UUID sessionId);
}
