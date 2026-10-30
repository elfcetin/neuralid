// Observer: Subject rolü (LLD: InteractionSubject)
export class InteractionSubject {
  constructor() {
    this.listeners = [];
  }
  subscribe(listener) {
    if (!this.listeners.includes(listener)) this.listeners.push(listener);
  }
  unsubscribe(listener) {
    this.listeners = this.listeners.filter((l) => l !== listener);
  }
  notify(event) {
    this.listeners.forEach((l) => l.onInteraction(event));
  }
}
