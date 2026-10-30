import { EventType } from './EventType';
import { createEvent, nowMs } from './InteractionEvent';

const FLUSH_THRESHOLD = 50;
const FLUSH_INTERVAL_MS = 5000;
const PAUSE_THRESHOLD_MS = 2000;

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
    if (!this.sessionId || this.eventsBuffer.length === 0) return;
    const batch = this.eventsBuffer.slice();
    // TODO: POST /api/v1/logs/sync (Zümra'nın endpoint'i hazır olunca)
    console.log('[Logger] sync', { sessionID: this.sessionId, events: batch });
    this.eventsBuffer.splice(0, batch.length);
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
