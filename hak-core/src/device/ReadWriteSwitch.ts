import { ReadWriteSwitchOptions } from './ReadWriteSwitchOptions';
import { ReadWriteDevice } from './ReadWriteDevice';

export class ReadWriteSwitch<T> {
  private on: boolean;
  private device: ReadWriteDevice<T>;
  public onCommand: T;
  public offCommand: T;
  public onResult: T;
  public offResult: T;
  public timeout: number;

  constructor(options: ReadWriteSwitchOptions) {
    Object.assign(this, options);
  }

  public isOn() {
    return this.on;
  }

  public async turnOn() {
    try {
      await this.device.fireAndWaitFor(this.onResult, this.timeout, this.onCommand);
      return true;
    } catch (error) {
      return false;
    }
  }

  public async turnOff() {
    try {
      await this.device.fireAndWaitFor(this.offResult, this.timeout, this.offCommand);
      return true;
    } catch (error) {
      return false;
    }
  }
}
