import { EventBus } from './EventBus';
import { WaitForEventOptions } from './WaitForEventOptions';

/**
 * Provides a utility container for waiting for events
 */
export class EventWaiter<T> {
  eventBus: EventBus;
  listener: (payload: T) => void;

  /**
   * Creates a new instance associated with the EventBus provided
   * @param eventBus EventBus instance to listen for events on
   */
  constructor(eventBus: EventBus) {
    this.eventBus = eventBus;
  }

  /**
   * Waits for an event to be fired and optionally executes a functions
   * prior to
   * @param options Options
   * @returns Promise resolved once the event is fired and optional filter is matched
   * and rejected when the timeout is exceeded
   */
  public waitForEvent(options: WaitForEventOptions<T>) {
    let resolved = false;
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!resolved) {
          reject(new Error(`Timeout waiting for event ${options.event}`));
        }
      }, options.timeout);

      this.listener = (payload) => {
        if (!options.filter || options.filter(payload)) {
          resolved = true;
          this.eventBus.removeListener(options.event, this.listener);

          if (options.after) {
            options.after();
          }

          resolve(payload);
        }
      };

      this.eventBus.addListener('event', this.listener);

      if (options.before) {
        options.before();
      }
    });
  }
}
