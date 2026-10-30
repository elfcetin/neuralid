import { useEffect, useRef, useState } from 'react';
import { InteractionSubject } from './InteractionSubject';
import { Logger } from '../logging/Logger';
import { EventType } from '../logging/EventType';
import { createEvent } from '../logging/InteractionEvent';
import { submitAnswer } from '../services/userSessionService';
import { ApiError } from '../services/apiClient';

function TaskView({ task, sessionId, current, total, onSubmitted }) {
  const [answer, setAnswer] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const submittingRef = useRef(false);
  const subjectRef = useRef(new InteractionSubject());

  useEffect(() => {
    const logger = Logger.getInstance();
    const subject = subjectRef.current;
    subject.subscribe(logger);
    logger.startSession(sessionId);
    return () => {
      logger.endSession();
      subject.unsubscribe(logger);
    };
  }, [sessionId]);

  function handleKeyDown(e) {
    const isDeletion = e.key === 'Backspace' || e.key === 'Delete';
    subjectRef.current.notify(
      createEvent(isDeletion ? EventType.DELETION : EventType.KEYSTROKE, isDeletion ? null : e.key)
    );
  }

  function handleClick(e) {
    subjectRef.current.notify(
      createEvent(EventType.MOUSE_CLICK, e.target.id || e.target.tagName)
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const trimmed = answer.trim();
    // Ref ile kilit: state güncellenmeden gelen ikinci tıklama/Enter'ı da engeller
    if (!trimmed || submittingRef.current) return;

    submittingRef.current = true;
    setSubmitting(true);
    setSubmitError(null);
    try {
      await Logger.getInstance().endSession();
      await submitAnswer(sessionId, trimmed);
      onSubmitted?.();
    } catch (err) {
      // 409: oturum zaten SUBMITTED (ör. zaman aşımına uğrayan ilk istek sunucuda kaydedilmiş)
      if (err instanceof ApiError && err.status === 409) {
        onSubmitted?.();
        return;
      }
      setSubmitError('Cevabınız gönderilemedi. Lütfen tekrar deneyin.');
      submittingRef.current = false;
      setSubmitting(false);
    }
  }

  return (
    <section className="task" onClick={handleClick}>
      <div className="task-meta">
        {current != null && total != null && (
          <span className="task-progress">Görev {current} / {total}</span>
        )}
        <span>Görev tipi: {task.taskType} · Zorluk: {task.difficulty}</span>
      </div>
      <h2 className="task-content">{task.content}</h2>
      <form onSubmit={handleSubmit} noValidate>
        <label className="visually-hidden" htmlFor="answer">Cevabınız</label>
        <input
          id="answer"
          className="answer-input"
          type="text"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Cevabınız"
          autoFocus
          autoComplete="off"
          onKeyDown={handleKeyDown}
          aria-invalid={submitError ? true : undefined}
          aria-describedby={submitError ? 'submit-error' : undefined}
        />
        {submitError && (
          <p id="submit-error" className="status status-error form-error" role="alert">{submitError}</p>
        )}
        <button id="submit" type="submit" className="btn-primary" disabled={!answer.trim() || submitting}>
          {submitting ? 'Gönderiliyor...' : 'Gönder'}
        </button>
      </form>
    </section>
  );
}

export default TaskView;