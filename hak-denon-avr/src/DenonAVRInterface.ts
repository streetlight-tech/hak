import { ReadWriteSwitch } from '../../hak-core/src/device/ReadWriteSwitch';
import { TelnetAdapter } from '../../hak-telnet-adapter/src/TelnetAdapter';

export class DenonAVRInterface {
  adapter: TelnetAdapter;
  mainZonePowerSwitch: ReadWriteSwitch;
  mainZoneMuteSwitch: ReadWriteSwitch;

  constructor(adapter: TelnetAdapter) {
    this.adapter = adapter;
    this.mainZonePowerSwitch = new ReadWriteSwitch({
      device: adapter,
      eventName: adapter.writeEvent,
      onCommand: 'PWON',
      offCommand: 'PWOFF',
      onResult: 'PWON',
      offResult: 'PWOFF',
      timeout: 1000,
    });
    this.mainZoneMuteSwitch = new ReadWriteSwitch({
      device: adapter,
      eventName: adapter.writeEvent,
      onCommand: 'MUON',
      offCommand: 'MUOFF',
      onResult: 'MUON',
      offResult: 'MUOFF',
      timeout: 1000,
    });
  }
}
