import { LocalEventBus } from '../../../src/bus/LocalEventBus';
import { EventTranslator } from '../../../src/bus/EventTranslator';
import { EventWaiter } from '../../../src/bus/EventWaiter';

describe('EventWaiter', () => {
  afterAll(() => jest.resetAllMocks());

  const sourceEvent = 'foo';
  const targetEvent = 'bar';

  it('should throw errors for invalid map options', () => {
    const source = new LocalEventBus();
    const target = new LocalEventBus();
    const translator = new EventTranslator(source, target);

    expect(() => {
      translator.mapEvent({
        sourceEvent,
        targetEvent,
      });
    }).toThrowError('Either targetPayload or targetTransform must be specified');

    expect(() => {
      translator.mapEvent({
        sourceEvent,
        targetEvent,
        targetPayload: 'foo',
        targetTransform: (payload) => payload,
      });
    }).toThrowError('Only specify targetPayload or targetTransform, not both');
  });

  it('should translate foo to bar', () => {
    const source = new LocalEventBus();
    const target = new LocalEventBus();
    const translator = new EventTranslator(source, target);

    const mockCallback = jest.fn();
    const targetPayload = 'baz';

    translator.mapEvent({
      sourceEvent,
      targetEvent,
      targetPayload,
    });

    target.addListener(targetEvent, mockCallback);
    source.fireEvent(sourceEvent, 'qux');

    expect(mockCallback.mock.calls.length).toBe(1);
    expect(mockCallback.mock.calls[0][0]).toBe('baz');
  });

  it('should apply filters on source events', () => {
    const source = new LocalEventBus();
    const target = new LocalEventBus();
    const translator = new EventTranslator(source, target);

    const mockCallback = jest.fn();
    const sourcePayload = 'baz';
    const targetPayload = 'qux';

    translator.mapEvent({
      sourceEvent,
      sourceFilter: (payload) => payload === sourcePayload,
      targetEvent,
      targetPayload,
    });

    translator.mapEvent({
      sourceEvent,
      sourceFilter: (payload) => {
        return payload !== sourcePayload;
      },
      targetEvent,
      targetPayload,
    });

    target.addListener(targetEvent, mockCallback);
    source.fireEvent(sourceEvent, 'fred');

    expect(mockCallback.mock.calls.length).toBe(1);
    expect(mockCallback.mock.calls[0][0]).toBe('qux');
  });

  it('should translate with a target function', () => {
    const source = new LocalEventBus();
    const target = new LocalEventBus();
    const translator = new EventTranslator(source, target);

    const mockCallback = jest.fn();
    const targetPayload = 'baz';

    translator.mapEvent({
      sourceEvent,
      targetEvent,
      targetTransform: (payload) => `${payload}->${targetPayload}`,
    });

    target.addListener(targetEvent, mockCallback);
    source.fireEvent(sourceEvent, 'qux');

    expect(mockCallback.mock.calls.length).toBe(1);
    expect(mockCallback.mock.calls[0][0]).toBe('qux->baz');
  });

  it('should translate with an async target function', async () => {
    const source = new LocalEventBus();
    const target = new LocalEventBus();
    const translator = new EventTranslator(source, target);

    const mockCallback = jest.fn();
    const targetPayload = 'baz';

    translator.mapEvent({
      sourceEvent,
      targetEvent,
      targetTransform: (payload) => Promise.resolve(`${payload}->${targetPayload}`),
    });

    target.addListener(targetEvent, mockCallback);

    await expect(
      EventWaiter.waitForEvent(target, {
        event: targetEvent,
        timeout: 1000,
        filter: (payload) => payload === 'qux->baz',
        before: () => {
          source.fireEvent(sourceEvent, 'qux');
        },
      }),
    ).resolves.toBe('qux->baz');
  });
});
