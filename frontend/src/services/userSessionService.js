import { post } from './apiClient';

// Anonim katılımcı kimliği (LLD: UserSessionService.userID)
const STORAGE_KEY = 'neuralid.userId';

export function getOrCreateUserId() {
  let userId = localStorage.getItem(STORAGE_KEY);
  if (!userId) {
    userId = crypto.randomUUID();
    localStorage.setItem(STORAGE_KEY, userId);
  }
  return userId;
}

// Backend'de yeni oturum açar, sessionID döner
export async function startTask(taskId) {
  const userID = getOrCreateUserId();
  const { sessionID } = await post('/api/v1/sessions/start', {
    userID,
    taskID: taskId,
    consentGiven: true,
  });
  return sessionID;
}

// Cevabı gönderir ve oturumu kapatır (doğru/yanlış bilgisi dönmez)
export async function submitAnswer(sessionId, finalAnswer) {
  await post('/api/v1/sessions/submit', { sessionID: sessionId, finalAnswer });
}
