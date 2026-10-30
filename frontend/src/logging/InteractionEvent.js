// Epoch milisaniye (LLD: performance.timeOrigin + performance.now())
export function nowMs() {
  return Math.round(performance.timeOrigin + performance.now());
}

// LLD: InteractionEvent { eventType, timestamp, value, sequenceNo }
export function createEvent(eventType, value = null) {
  return { eventType, timestamp: nowMs(), value, sequenceNo: null };
}
