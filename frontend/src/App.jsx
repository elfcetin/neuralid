import { useEffect, useState } from 'react';
import { get } from './services/apiClient';
import { getOrCreateUserId } from './services/userSessionService';
import ConsentScreen from './ui/ConsentScreen';
import TaskView from './ui/TaskView';

const DEMO_TASK_ID = '11111111-1111-1111-1111-111111111101';

function App() {
  const [consentGiven, setConsentGiven] = useState(false);
  const [task, setTask] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!consentGiven) return;
    get(`/api/v1/tasks/${DEMO_TASK_ID}`)
      .then(setTask)
      .catch((err) => setError(err.message));
  }, [consentGiven]);

  function handleAccept() {
    const userId = getOrCreateUserId();
    console.log('Participant:', userId);
    setConsentGiven(true);
  }

  return (
    <main className="page">
      <header className="site-header">
        <h1>NeuralID</h1>
      </header>
      <div className="card">
        {!consentGiven && <ConsentScreen onAccept={handleAccept} />}
        {consentGiven && error && <p className="status status-error" role="alert">Hata: {error}</p>}
        {consentGiven && !error && !task && <p className="status" role="status">Yükleniyor...</p>}
        {consentGiven && task && <TaskView task={task} current={1} total={6} />}
      </div>
    </main>
  );
}

export default App;