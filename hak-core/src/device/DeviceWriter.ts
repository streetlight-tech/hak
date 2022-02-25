import { StateChange } from '../state/StateChange';

export interface DeviceWriter {
  requestStateChange: (change: StateChange) => void;
}
