import { useState } from 'react';

function TaskView({ task, current, total }) {
  const [answer, setAnswer] = useState('');

  return (
    <section className="task">
      <div className="task-meta">
        {current != null && total != null && (
          <span className="task-progress">Görev {current} / {total}</span>
        )}
        <span>Görev tipi: {task.taskType} · Zorluk: {task.difficulty}</span>
      </div>
      <h2 className="task-content">{task.content}</h2>
      <label className="visually-hidden" htmlFor="answer-input">Cevabınız</label>
      <input
        id="answer-input"
        className="answer-input"
        type="text"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="Cevabınız"
        autoFocus
        autoComplete="off"
      />
      <button className="btn-primary" disabled={!answer.trim()}>Gönder</button>
    </section>
  );
}

export default TaskView;