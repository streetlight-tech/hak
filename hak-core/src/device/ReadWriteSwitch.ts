import { ReadWriteSwitchOptions } from './ReadWriteSwitchOptions';
import { ReadWriteDevice } from './ReadWriteDevice';
import { EventManager } from '../bus/EventManager';

export class ReadWriteSwitch {
  private on: boolean;
  private device: ReadWriteDevice;
  public eventName: string;
  public onCommand: string;
  public offCommand: string;
  public onResult: string;
  public offResult: string;
  public timeout: number;
  public eventManager: EventManager;

  constructor(options: ReadWriteSwitchOptions) {
    Object.assign(this, options);
    this.eventManager = new EventManager(this.device.eventBus);
  }

  public isOn() {
    return this.on;
  }

  public async turnOn() {
    try {
      await this.eventManager.fireAndWaitForEvent(this.eventName, this.onResult, this.timeout, this.onCommand);
      return true;
    } catch (error) {
      return false;
    }
  }

  public async turnOff() {
    try {
      await this.eventManager.fireAndWaitForEvent(this.eventName, this.offResult, this.timeout, this.offCommand);
      return true;
    } catch (error) {
      return false;
    }
  }
}
