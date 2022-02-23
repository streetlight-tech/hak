import { EventBus } from './EventBus';

export class EventWaiter<T> {
  eventBus: EventBus;
  listener: (payload: T) => void;

  constructor(eventBus: EventBus) {
    this.eventBus = eventBus;
  }

  public waitForEvent(options: {
    event: string;
    timeout: number;
    filter?: (payload: T) => boolean;
    before?: () => void;
    after?: () => void;
  }) {
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
