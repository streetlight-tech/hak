import { EventBus } from '../../hak-core/src/bus/EventBus';

export interface TelnetAdapterOptions {
  host: string;
  port?: number;
  timeout?: number;
  initCommands?: string[];
  readEvent: string;
  writeEvent: string;
  eventBus: EventBus;
}
