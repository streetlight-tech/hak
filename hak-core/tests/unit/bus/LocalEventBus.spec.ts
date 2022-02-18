import { LocalEventBus } from '../../../src/bus/LocalEventBus';

describe('LocalEventBus', () => {
  afterAll(() => jest.resetAllMocks());

  it('should fire and handle events', () => {
    const bus = new LocalEventBus();
    const eventName = 'foo';
    const mockCallback = jest.fn();

    bus.addListener<string>(eventName, mockCallback);
    bus.fireEvent<string>(eventName, 'bar');
    expect(mockCallback.mock.calls.length).toBe(1);
    expect(mockCallback.mock.calls[0][0]).toBe('bar');
  });
});
