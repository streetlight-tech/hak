import { LocalEventBus } from '../../../src/bus/LocalEventBus';

describe('LocalEventBus', () => {
  afterAll(() => jest.resetAllMocks());

  const bus = new LocalEventBus();
  const eventName = 'foo';

  it('should send event payloads to listeners', () => {
    const mockCallback = jest.fn();

    bus.addListener<string>(eventName, mockCallback);
    bus.fireEvent<string>(eventName, 'bar');
    bus.fireEvent<string>(eventName, 'baz');

    expect(mockCallback.mock.calls.length).toBe(2);
    expect(mockCallback.mock.calls[0][0]).toBe('bar');
    expect(mockCallback.mock.calls[1][0]).toBe('baz');
  });

  it('should ignore events after listener is removed', () => {
    const mockCallback = jest.fn();

    bus.addListener<string>(eventName, mockCallback);
    bus.fireEvent<string>(eventName, 'bar');

    bus.removeListener<string>(eventName, mockCallback);
    bus.fireEvent<string>(eventName, 'baz');

    expect(mockCallback.mock.calls.length).toBe(1);
    expect(mockCallback.mock.calls[0][0]).toBe('bar');
  });
});
