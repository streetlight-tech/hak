import { EventBus } from '../bus/EventBus';
import { EventData } from '../bus/EventData';
import { StateChange } from '../state/StateChange';
import { DeviceReader } from './DeviceReader';
import { DeviceWriter } from './DeviceWriter';

export class ReadWriteDevice<TRead extends object> {
  state: TRead;
  eventBus: EventBus;
  private reader: DeviceReader<TRead>;
  private writer: DeviceWriter;

  constructor(eventBus: EventBus, readEvent: string, eventWriter: DeviceWriter) {
    this.reader = new DeviceReader<TRead>(eventBus, readEvent);
    this.writer = eventWriter;
  }

  requestWrite(change: StateChange) {
    this.writer.requestStateChange(change);
  }

}
