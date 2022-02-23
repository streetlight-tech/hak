import { LocalEventBus } from '../../../src/bus/LocalEventBus';
import { EventWaiter } from '../../../src/bus/EventWaiter';

describe('EventWaiter', () => {
  afterAll(() => jest.resetAllMocks());

  const bus = new LocalEventBus();
  const event = 'foo';
  const timeout = 1000;

  it('should wait for an event', async () => {
    const mockCallback = jest.fn();
    
    bus.addListener(event, mockCallback);
    await EventWaiter.waitForEvent(bus, {
      event,
      timeout,
      filter: payload => payload === 'bar',
      before: () => bus.fireEvent(event, 'bar'),
      after: () => bus.fireEvent(event, 'baz'),
    });
    
    
    expect(mockCallback.mock.calls.length).toBe(2);
    expect(mockCallback.mock.calls[0][0]).toBe('bar');
    expect(mockCallback.mock.calls[1][0]).toBe('baz');
  });
  
  it('should timeout if event is not fired', async () => {
    await expect(EventWaiter.waitForEvent(bus, {
        event,
        timeout: 10,
      })).rejects.toThrow(`Timeout waiting for event ${event}`);
  });

  it('should timeout if filter is not met', async () => {
    await expect(EventWaiter.waitForEvent(bus, {
      event,
      timeout: 10,
      filter: payload => payload === 'invalid',
      before: () => bus.fireEvent(event, 'bar'),
    })).rejects.toThrow(`Timeout waiting for event ${event}`);
  });
});
