import { EventType } from './EventType';
import { createEvent, nowMs } from './InteractionEvent';
import { post } from '../services/apiClient';

const FLUSH_THRESHOLD = 50;
const FLUSH_INTERVAL_MS = 5000;
const PAUSE_THRESHOLD_MS = 2000;
const MAX_BATCH_SIZE = 500;      // backend @Size(max = 500)
const MAX_SYNC_ATTEMPTS = 3;     // LLD: en fazla 3 deneme

let instance = null; // Singleton: sekme başına tek Logger

export class Logger {
  static getInstance() {
    if (!instance) instance = new Logger();
    return instance;
  }

  constructor() {
    this.sessionId = null;
    this.eventsBuffer = [];
    this.sequenceNo = 0;
    this.lastEventTime = null;
    this.timer = null;
    this.handleUnload = () => this.endSession();
  }

  startSession(sessionId) {
    this.endSession(); // önceki oturum açık kaldıysa kapat
    this.sessionId = sessionId;
    this.eventsBuffer = [];
    this.sequenceNo = 0;
    this.lastEventTime = nowMs();
    this.timer = setInterval(() => this.syncData(), FLUSH_INTERVAL_MS);
    window.addEventListener('beforeunload', this.handleUnload);
  }

  // Observer: Subject her olayda bunu çağırır
  onInteraction(event) {
    this.detectPause(event.timestamp);
    this.logEvent(event);
  }

  logEvent(event) {
    if (!this.sessionId) return;
    event.sequenceNo = this.sequenceNo++;
    this.eventsBuffer.push(event);
    this.lastEventTime = event.timestamp;
    if (this.eventsBuffer.length >= FLUSH_THRESHOLD) this.syncData();
  }

  detectPause(now) {
    if (this.lastEventTime === null) return;
    const gap = now - this.lastEventTime;
    if (gap >= PAUSE_THRESHOLD_MS) {
      this.logEvent(createEvent(EventType.PAUSE, String(gap)));
    }
  }

  syncData() {
    // endSession bizi çağırdıktan hemen sonra sessionId'yi null yapıyor,
    // o yüzden ikisini de şimdi yakalıyoruz.
    const sessionId = this.sessionId;
    const buffer = this.eventsBuffer;

    const send = async () => {
      if (!sessionId || buffer.length === 0) return;
      const batch = buffer.slice(0, MAX_BATCH_SIZE);
      try {
        await post('/api/v1/logs/sync', { sessionID: sessionId, events: batch });
        buffer.splice(0, batch.length);          // sadece başarıda çıkar
        this.syncAttempts = 0;
      } catch (err) {
        this.syncAttempts = (this.syncAttempts ?? 0) + 1;
        if (this.syncAttempts >= MAX_SYNC_ATTEMPTS) {
          console.warn(`[Logger] ${batch.length} olay ${MAX_SYNC_ATTEMPTS} denemede gönderilemedi, bırakılıyor`, err);
          buffer.splice(0, batch.length);
          this.syncAttempts = 0;
        }
        throw err;                               // hata yutulmuyor, çağıran görür
      }
    };

    // Gönderimleri sıraya diz: önceki bitmeden yenisi başlamaz.
    const previous = this.syncPromise ?? Promise.resolve();
    const current = previous.catch(() => {}).then(send);
    this.syncPromise = current;

    // Timer'dan gelen çağrıyı kimse await etmiyor; tarayıcı "unhandled rejection"
    // demesin diye burada da yakalayıp logluyoruz. Await eden (endSession) hatayı yine görür.
    current
        .catch((err) => console.warn('[Logger] sync başarısız', err))
        .finally(() => {
          if (this.syncPromise === current) this.syncPromise = null;
        });

    return current;
  }

  // Promise döner: syncData ileride async olacağı için çağıran await edebilsin
  async endSession() {
    if (!this.sessionId) return;
    clearInterval(this.timer);
    window.removeEventListener('beforeunload', this.handleUnload);
    const result = this.syncData();
    this.sessionId = null;
    this.lastEventTime = null;
    return result;
  }
}