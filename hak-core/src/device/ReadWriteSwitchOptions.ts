import { ReadWriteDevice } from './ReadWriteDevice';

export interface ReadWriteSwitchOptions<T> {
  device: ReadWriteDevice<T>;
  eventName: string;
  onCommand: string;
  offCommand: string;
  onResult: string;
  offResult: string;
  timeout: number;
}
