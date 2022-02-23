import { EventBus } from '../bus/EventBus';

export interface ReadWriteDevice {
  eventBus: EventBus;
  readEvent: string;
  writeEvent: string;
}
