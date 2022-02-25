import { StateMonitor } from '../state/StateMonitor';
import { EventBus } from '../bus/EventBus';
import { StateChange } from '../state/StateChange';

export class DeviceReader<T extends object> {
  stateMonitor: StateMonitor<T>;
  private eventBus: EventBus;
  private event: string;

  constructor(eventBus: EventBus, event: string) {
    this.eventBus = eventBus;
    this.event = event;
    this.stateMonitor = new StateMonitor(DeviceReader.createListener(this));
  }

  private static createListener<T extends object>(reader: DeviceReader<T>) {
    return (change: StateChange) => {
      reader.eventBus.fireEvent(reader.event, change);
    };
  }

  setState(state: T) {
    this.stateMonitor.setState(state);
  }
}
