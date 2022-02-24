import { LocalEventBus } from '../../../hak-core/src/bus/LocalEventBus';
import { TelnetAdapter } from '../../../hak-telnet-adapter/src/TelnetAdapter';
import { DenonAVRInterface } from '../../src/DenonAVRInterface';
import { jest } from '@jest/globals';

describe('DenonAVRInterface', () => {
  afterAll(() => jest.resetAllMocks());

  const event = 'DENON';

  it('should turn mute on and off', async () => {
    const mockCallback = jest.fn();
    const eventBus = new LocalEventBus();
    const adapter = new TelnetAdapter({
      host: '192.168.1.34',
      readEvent: 'DENON:READ',
      writeEvent: 'DENON:WRITE',
      eventBus,
    });
    const avr = new DenonAVRInterface(adapter, event);

    adapter.device.readTranslator.target.addListener(event, mockCallback);
    adapter.device.readTranslator.target.addListener(event, console.log);

    try {
      await adapter.start();
      avr.setState({
        zones: {
          main: {
            mute: true,
          },
        },
      });
      avr.setState({
        zones: {
          main: {
            mute: false,
          },
        },
      });
      await adapter.stop();
    } catch (err) {
      console.log(err);
    }

    expect(mockCallback.mock.calls.length).toBe(1);
    expect(mockCallback.mock.calls[0][0]).toEqual({ key: 'DENON.zones.main.mute', oldValue: true, newValue: false });
  });
});
