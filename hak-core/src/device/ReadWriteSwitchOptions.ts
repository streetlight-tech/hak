import { ReadWriteDevice } from './ReadWriteDevice';

export interface ReadWriteSwitchOptions {
  device: ReadWriteDevice;
  eventName: string;
  onCommand: string;
  offCommand: string;
  onResult: string;
  offResult: string;
  timeout: number;
}
