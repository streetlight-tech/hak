import { DenonAVRState } from './DenonAVRState';
import { TelnetAdapter } from '../../hak-telnet-adapter/src/TelnetAdapter';
import { StateMonitor } from '../../hak-core/src/state/StateMonitor';
import { StateChange } from '../../hak-core/src/state/StateChange';

export class DenonAVRInterface {
  adapter: TelnetAdapter;
  stateListener: StateMonitor<DenonAVRState>;
  key: string;
  constructor(adapter: TelnetAdapter, key: string) {
    this.adapter = adapter;
    this.key = key;
    this.stateListener = new StateMonitor(key, this.createListener(this.adapter));
    this.mapReadEvents();
    this.mapWriteEvents();
  }

  setState(state: DenonAVRState) {
    this.stateListener.setState(state);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private createListener(adapter: TelnetAdapter) {
    return (change: StateChange) => {
      adapter.device.writeTranslator.source.fireEvent(this.key, change);
    };
  }

  //TODO: Move this to ReadWriteDevice and then use that in TelnetAdapter.
  private mapReadEvents() {
    const maps = [
      {
        key: 'main.power',
        targetTransform: (c: string) => true,
        sourceFilter: (c: string) => c == 'PWON',
      },
      {
        key: 'main.power',
        targetTransform: (c: string) => false,
        sourceFilter: (c: string) => c == 'PWOFF',
      },
      {
        key: 'main.mute',
        targetTransform: (c: string) => true,
        sourceFilter: (c: string) => c == 'MUON',
      },
      {
        key: 'main.mute',
        targetTransform: (c: string) => false,
        sourceFilter: (c: string) => c == 'MUOFF',
      },
    ];
    maps.map((m) => this.mapReadEvent(m.key, m.targetTransform, m.sourceFilter));
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private mapReadEvent(key: string, targetTransform: (c: string) => any, sourceFilter: (c: string) => any) {
    this.adapter.device.writeTranslator.mapEvent<string, string>({
      sourceEvent: this.key,
      sourceFilter,
      targetEvent: 'send',
      targetTransform,
    });
  }

  private mapWriteEvents() {
    const maps = [
      {
        key: 'main.power',
        payload: true,
        command: 'PWON',
      },
      {
        key: 'main.power',
        payload: false,
        command: 'PWOFF',
      },
      {
        key: 'main.mute',
        payload: true,
        command: 'MUON',
      },
      {
        key: 'main.mute',
        payload: false,
        command: 'MUOFF',
      },
    ];
    maps.map((m) => this.mapWriteEvent(m.key, m.payload, m.command));
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private mapWriteEvent(key: string, payload: any, command: string) {
    this.adapter.device.writeTranslator.mapEvent<StateChange, string>({
      sourceEvent: this.key,
      sourceFilter: (p) => p.key == `${this.key}.${key}` && p.newValue == payload,
      targetEvent: 'send',
      targetPayload: command,
    });
  }
}
