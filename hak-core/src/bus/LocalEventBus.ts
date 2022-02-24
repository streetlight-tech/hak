import { EventEmitter } from 'events';
import { EventBus } from './EventBus';

/**
 * Provides an implementation of EventBus for local in-memory event handling.
 */
export class LocalEventBus implements EventBus {
  private eventEmitter: EventEmitter;

  /**
   * Creates a new instance of LocalEventBus.
   * @param emitter Optional event emitter
   */
   constructor(emitter?: EventEmitter) {
    this.eventEmitter = emitter ?? new EventEmitter();
  }

  /**
   * Adds a listener for events with the specified name.
   * @param event Name of event to listen for
   * @param callback Callback to execute when an event is fired with the specified name
   */
  public addListener<T>(event: string, callback: (payload: T) => void) {
    this.eventEmitter.on(event, callback);
  }

  /**
   * Removes a listener for events with the specified name.
   * @param event Name of event to listen for
   * @param callback Callback to remove
   */
  public removeListener<T>(event: string, callback: (payload: T) => void) {
    this.eventEmitter.removeListener(event, callback);
  }

  /**
   * Fires an event with the specified name.
   * @param event Name of event to fire
   * @param payload Contents of event to pass to callback of registered listeners
   */
  public fireEvent<T>(event: string, payload: T) {
    this.eventEmitter.emit(event, payload);
  }
}
