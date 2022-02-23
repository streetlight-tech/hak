import { EventBus } from '../bus/EventBus';
import { EventWaiter } from '../bus/EventWaiter';
import { EventReader } from '../bus/EventReader';
import { EventWriter } from '../bus/EventWriter';

export class ReadWriteDevice<T> {
  readEvent: string;
  writeEvent: string;
  eventBus: EventBus;
  eventReader: EventReader<T>;
  eventWriter: EventWriter<T>;

  constructor(eventBus: EventBus, readEvent: string, writeEvent: string) {
    this.readEvent = readEvent;
    this.writeEvent = writeEvent;
    this.eventBus = eventBus;
    this.eventReader = new EventReader(eventBus, readEvent);
    this.eventWriter = new EventWriter(eventBus, writeEvent);
  }

  /**
   * Fires an event and returns a promise that is resolved once another event is fired.
   * @param waitFor Event to wait for
   * @param timeout Timeout in milliseconds
   * @param payload Payload for event to fire
   * @param filter Optional filter function to apply on event listener
   */
  public fireAndWaitFor(waitFor: T, timeout: number, payload: T, filter?: (payload: T) => boolean) {
    const eventWaiter = new EventWaiter<T>(this.eventBus);
    return eventWaiter.waitForEvent({
      event: this.readEvent,
      timeout,
      filter,
      before: () => {
        this.eventWriter.write(payload);
      },
    });
  }
}
