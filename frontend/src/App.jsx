import { useEffect, useState } from 'react';
import { get } from './services/apiClient';
import { startTask } from './services/userSessionService';
import ConsentScreen from './ui/ConsentScreen';
import TaskView from './ui/TaskView';

const DEMO_TASK_ID = '11111111-1111-1111-1111-111111111101';

function App() {
  const [consentGiven, setConsentGiven] = useState(false);
  const [task, setTask] = useState(null);
  const [error, setError] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!consentGiven) return;
    get(`/api/v1/tasks/${DEMO_TASK_ID}`)
      .then(setTask)
      .catch((err) => setError(err.message));
  }, [consentGiven]);

  function handleAccept() {
    setConsentGiven(true);
    startTask(DEMO_TASK_ID)
      .then(setSessionId)
      .catch((err) => setError(err.message));
  }

  return (
    <main className="page">
      <header className="site-header">
        <h1>NeuralID</h1>
      </header>
      <div className="card">
        {!consentGiven && <ConsentScreen onAccept={handleAccept} />}
        {consentGiven && error && <p className="status status-error" role="alert">Hata: {error}</p>}
        {consentGiven && !error && (!task || !sessionId) && <p className="status" role="status">Yükleniyor...</p>}
        {consentGiven && !error && task && sessionId && !submitted && (
          <TaskView task={task} sessionId={sessionId} current={1} total={6} onSubmitted={() => setSubmitted(true)} />
        )}
        {/* Doğru/yanlış bilgisi bilerek gösterilmiyor: katılımcının davranışını etkilemesin */}
        {submitted && <p className="status status-success" role="status">Cevabınız kaydedildi. Katılımınız için teşekkürler.</p>}
      </div>
    </main>
  );
}

export default App;