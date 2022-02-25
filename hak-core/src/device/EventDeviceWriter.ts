import { EventBus } from '../bus/EventBus';
import { EventData } from '../bus/EventData';
import { StateChange } from '../state/StateChange';
import { DeviceWriter } from './DeviceWriter';

export class EventDeviceWriter<T> implements DeviceWriter{
  eventBus: EventBus;
  handler: (change: StateChange) => EventData<T>;

  constructor(eventBus: EventBus, handler: (change: StateChange) => EventData<T>) {
    this.eventBus = eventBus;
    this.handler = handler;
  }

  requestStateChange(change: StateChange) {
    const eventData = this.handler(change);
    this.eventBus.fireEvent(eventData.event, eventData.payload);
  }
}