import { LocalEventBus } from '../../../hak-core/src/bus/LocalEventBus';
import { TelnetAdapter } from '../../../hak-telnet-adapter/src/TelnetAdapter';
import { DenonAVRInterface } from '../../src/DenonAVRInterface';
import { jest } from '@jest/globals';

describe('DenonAVRInterface', () => {
  afterAll(() => jest.resetAllMocks());

  it('should turn mute on', async () => {
    const mockCallback = jest.fn();
    const eventBus = new LocalEventBus();
    const adapter = new TelnetAdapter({
      host: '192.168.1.34',
      readEvent: 'DENON:READ',
      writeEvent: 'DENON:WRITE',
      eventBus,
    });
    const avr = new DenonAVRInterface(adapter);

    eventBus.addListener<string>(adapter.readEvent, mockCallback);
    eventBus.addListener<string>(adapter.readEvent, payload => {
      if (payload === 'MUOFF') {
        adapter.stop();
      }
    });

    try {
        await adapter.start();
        await avr.mainZoneMuteSwitch.turnOn();
        await avr.mainZoneMuteSwitch.turnOff();
        await adapter.stop();
    } catch (err) {
      console.log(err);
    }

    expect(mockCallback.mock.calls.length).toBe(2);
    expect(mockCallback.mock.calls[0][0]).toBe('MUON\r');
  });
});
