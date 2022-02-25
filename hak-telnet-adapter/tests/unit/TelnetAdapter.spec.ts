import { TelnetAdapter } from '../../src/TelnetAdapter';
import { LocalEventBus } from '../../../hak-core/src/bus/LocalEventBus';
import { SendOptions } from 'telnet-client';
import { Callback } from 'telnet-client/lib/utils';

describe('TelnetAdapter', () => {
  afterAll(() => jest.resetAllMocks());

  const sentValues: (string | Buffer)[] = [];
  const mockCallback = jest.fn();

  it('should fire and handle events', async () => {
    const adapter = new TelnetAdapter({
      host: '',
      timeout: 300,
      readEvent: 'TELNET:READ',
      writeEvent: 'TELNET:WRITE',
      initCommands: ['foo'],
      eventBus: new LocalEventBus(),
    });

    adapter.mapData(adapter.readEvent, payload => `processed:${payload}`);

    jest.spyOn(adapter.connection, 'connect').mockImplementation(() => {
      return Promise.resolve();
    });

    jest
      .spyOn(adapter.connection, 'send')
      .mockImplementation(
        (data: Buffer | string, opts?: SendOptions | Callback<string>, callback?: Callback<string>) => {
          sentValues.push(data.toString());

          return Promise.resolve('');
        },
      );

    const connectionListener = jest.fn();
    jest
      .spyOn(adapter.connection, 'on')
      .mockImplementation((eventName: string | symbol, listener: (...args: any[]) => void) => {
        connectionListener.mockImplementation((data: string) => listener(data));

        return adapter.connection;
      });

    adapter.eventBus.addListener(adapter.readEvent, mockCallback);
    adapter.eventBus.addListener(adapter.readEvent, adapter.stop);

    await adapter.start();

    adapter.device.writeTranslator.source.fireEvent(adapter.writeEvent, 'sent');

    connectionListener('received');

    expect(sentValues.length).toBe(1);
    expect(sentValues.sort()).toEqual(['foo', 'sent'].sort());
    expect(mockCallback.mock.calls.length).toBe(1);
    expect(mockCallback.mock.calls[0][0]).toBe('received');
  });
});
