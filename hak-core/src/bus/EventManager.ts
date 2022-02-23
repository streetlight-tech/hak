import { EventBus } from './EventBus';
import { EventWaiter } from './EventWaiter';

export class EventManager {
  private eventBus: EventBus;

  constructor(eventBus: EventBus) {
    this.eventBus = eventBus;
  }

  /**
   * Returns a promise resolved when then an event is fired and rejected after the timeout
   * @param event Name of event to wait for
   * @param timeout Timeout in milliseconds
   * @param filter Optional filter function to apply on event listener
   */
  public waitForEvent<T>(event: string, timeout: number, filter?: (payload: T) => boolean) {
    const eventWaiter = new EventWaiter<T>(this.eventBus);
    return eventWaiter.waitForEvent({ event, timeout, filter });
  }

  /**
   * Fires an event and returns a promise that is resolved once another event is fired.
   * @param fire Event to fire
   * @param waitFor Event to wait for
   * @param timeout Timeout in milliseconds
   * @param payload Payload for event to fire
   * @param filter Optional filter function to apply on event listener
   */
  public fireAndWaitForEvent<T>(
    fire: string,
    waitFor: string,
    timeout: number,
    payload: T,
    filter?: (payload: T) => boolean,
  ) {
    const eventWaiter = new EventWaiter<T>(this.eventBus);
    return eventWaiter.waitForEvent({
      event: waitFor,
      timeout,
      filter,
      before: () => {
        this.eventBus.fireEvent<T>(fire, payload);
      },
    });
  }
}
