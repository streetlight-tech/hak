import { EventBus } from './EventBus';
import { WaitForEventOptions } from './WaitForEventOptions';

/**
 * Provides a utility container for waiting for events
 */
export class EventWaiter<T> {
  private eventBus: EventBus;
  private listener: (payload: T) => void;
  private resolved: boolean;

  /**
   * Creates a new instance associated with the EventBus provided
   * @param eventBus EventBus instance to listen for events on
   */
  constructor(eventBus: EventBus) {
    this.eventBus = eventBus;
  }

  /**
   * Waits for an event to be fired and optionally executes a functions
   * prior to resolving the promise
   * @param options Options
   * @returns Promise resolved once the event is fired and optional filter is matched
   * and rejected when the timeout is exceeded
   */
  private waitForEvent(options: WaitForEventOptions<T>) {
    this.resolved = false;
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!this.resolved) {
          reject(new Error(`Timeout waiting for event ${options.event}`));
        }
      }, options.timeout);

      this.listener = (payload) => {
        if (!options.filter || options.filter(payload)) {
          this.resolved = true;
          this.eventBus.removeListener(options.event, this.listener);

          if (options.after) {
            options.after();
          }

          resolve(payload);
        }
      };

      this.eventBus.addListener(options.event, this.listener);

      if (options.before) {
        options.before();
      }
    });
  }

  public static async waitForEvent<T>(eventBus: EventBus, options: WaitForEventOptions<T>) {
    const eventWaiter = new EventWaiter(eventBus);

    return eventWaiter.waitForEvent(options);
  }
}
