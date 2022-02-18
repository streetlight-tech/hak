/**
 * Provides an interface for implementing an event bus. The event bus supports attaching listeners to events and firing
 * events. The event consists of an event name (string) and a generic payload of type T.
 */
export interface EventBus {
  /**
   * Adds a listener for events with the specified name.
   * @param event Name of event to listen for
   * @param callback Callback to execute when an event is fired with the specified name
   */
  addListener<T>(event: string, callback: (payload: T) => void): void;

  /**
   * Fires an event with the specified name.
   * @param event Name of event to fire
   * @param payload Contents of event to pass to callback of registered listeners
   */
   fireEvent<T>(event: string, payload: T): void;
}
