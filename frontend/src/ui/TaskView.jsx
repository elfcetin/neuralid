import { useEffect, useRef, useState } from 'react';
import { InteractionSubject } from './InteractionSubject';
import { Logger } from '../logging/Logger';
import { EventType } from '../logging/EventType';
import { createEvent } from '../logging/InteractionEvent';

function TaskView({ task, sessionId, current, total }) {
  const [answer, setAnswer] = useState('');
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

  return (
    <section className="task" onClick={handleClick}>
      <div className="task-meta">
        {current != null && total != null && (
          <span className="task-progress">Görev {current} / {total}</span>
        )}
        <span>Görev tipi: {task.taskType} · Zorluk: {task.difficulty}</span>
      </div>
      <h2 className="task-content">{task.content}</h2>
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
      />
      <button id="submit" className="btn-primary" disabled={!answer.trim()}>Gönder</button>
    </section>
  );
}

export default TaskView;