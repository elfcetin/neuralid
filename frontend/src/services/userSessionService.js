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