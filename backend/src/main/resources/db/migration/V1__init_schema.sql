-- Anonim katılımcı (KVKK: isim/e-posta yok, sadece rastgele UUID)
CREATE TABLE participant (
                             participant_id UUID PRIMARY KEY,
                             consent_given  BOOLEAN     NOT NULL,
                             created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Katılımcıya gösterilen görevler
CREATE TABLE task (
                      task_id        UUID PRIMARY KEY,
                      task_type      VARCHAR(20) NOT NULL CHECK (task_type IN ('LOGIC', 'MATH', 'PUZZLE')),
                      difficulty     INT         NOT NULL CHECK (difficulty BETWEEN 1 AND 5),
                      content        TEXT        NOT NULL,
                      correct_answer TEXT        NOT NULL
);

-- Bir katılımcının bir görevi çözme denemesi
CREATE TABLE task_session (
                              session_id     UUID PRIMARY KEY,
                              participant_id UUID        NOT NULL REFERENCES participant (participant_id),
                              task_id        UUID        NOT NULL REFERENCES task (task_id),
                              status         VARCHAR(20) NOT NULL DEFAULT 'STARTED'
                                  CHECK (status IN ('STARTED', 'SUBMITTED', 'PROCESSED', 'FAILED', 'ABANDONED')),
                              final_answer   TEXT,
                              is_correct     BOOLEAN,
                              started_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
                              submitted_at   TIMESTAMPTZ
);

-- Ham etkileşim olayları (tuş, silme, duraklama, tıklama)
CREATE TABLE interaction_event (
                                   event_id        BIGSERIAL PRIMARY KEY,
                                   session_id      UUID        NOT NULL REFERENCES task_session (session_id),
                                   event_type      VARCHAR(20) NOT NULL CHECK (event_type IN ('KEYSTROKE', 'DELETION', 'PAUSE', 'MOUSE_CLICK')),
                                   event_timestamp BIGINT      NOT NULL,
                                   value           TEXT,
                                   sequence_no     INT         NOT NULL CHECK (sequence_no >= 0),
                                   CONSTRAINT uq_event_session_seq UNIQUE (session_id, sequence_no)
);

-- Oturumdan çıkarılan davranış vektörü (oturum başına bir tane)
CREATE TABLE behavior_vector (
                                 vector_id     UUID PRIMARY KEY,
                                 session_id    UUID               NOT NULL UNIQUE REFERENCES task_session (session_id),
                                 feature_names TEXT[]             NOT NULL,
                                 features      DOUBLE PRECISION[] NOT NULL,
                                 created_at    TIMESTAMPTZ        NOT NULL DEFAULT now()
);