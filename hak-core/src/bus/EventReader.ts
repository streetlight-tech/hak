import { EventBus } from './EventBus';
import { EventWaiter } from './EventWaiter';

export class EventReader<T> {
  eventBus: EventBus;
  event: string;

  constructor(eventBus: EventBus, event: string) {
    this.eventBus = eventBus;
    this.event = event;
  }

  public addListener(listener: (payload: T) => void) {
    this.eventBus.addListener(this.event, listener);
  }

  /**
   * Returns a promise resolved when then an event is fired and rejected after the timeout
   * @param timeout Timeout in milliseconds
   * @param filter Optional filter function to apply on event listener
   */
  public waitForEvent(timeout: number, filter?: (payload: T) => boolean) {
    const eventWaiter = new EventWaiter<T>(this.eventBus);
    return eventWaiter.waitForEvent({ event: this.event, timeout, filter });
  }
}
