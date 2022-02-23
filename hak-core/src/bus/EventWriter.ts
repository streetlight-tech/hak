import { EventBus } from './EventBus';

export class EventWriter<T> {
  eventBus: EventBus;
  event: string;

  constructor(eventBus: EventBus, event: string) {
    this.eventBus = eventBus;
    this.event = event;
  }

  public write(payload: T) {
    this.eventBus.fireEvent(this.event, payload);
  }
}
