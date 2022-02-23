import { TelnetAdapter } from '../../src/TelnetAdapter';
import { LocalEventBus } from '../../../hak-core/src/bus/LocalEventBus';

describe('TelnetAdapter', () => {
  afterAll(() => jest.resetAllMocks());

  const mockCallback = jest.fn();

  it('should fire and handle events', async () => {

    const adapter = new TelnetAdapter({
      host: '192.168.1.34',
      timeout: 300,
      readEvent: 'TELNET:READ',
      writeEvent: 'TELNET:WRITE',
      initCommands: [
      ],
      eventBus: new LocalEventBus(),
    });

    try {
      const promise = new Promise((resolve, reject) => {
        adapter.eventBus.addListener<string>(adapter.readEvent, (payload) => {
          mockCallback(payload);
          adapter.stop().then(resolve);
        });
      });

      await adapter.start();
      await adapter.send('PW?');

      await promise;
    } catch (err) {
      console.log(err);
    }

    expect(mockCallback.mock.calls.length).toBe(1);
    expect(mockCallback.mock.calls[0][0]).toBe('PWON\r');
  });
});
