import { useState } from 'react';

function TaskView({ task }) {
  const [answer, setAnswer] = useState('');

  return (
    <section>
      <p>Görev tipi: {task.taskType} · Zorluk: {task.difficulty}</p>
      <h2>{task.content}</h2>
      <input
        type="text"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="Cevabınız"
        autoFocus
      />
      <button disabled={!answer.trim()}>Gönder</button>
    </section>
  );
}

export default TaskView;