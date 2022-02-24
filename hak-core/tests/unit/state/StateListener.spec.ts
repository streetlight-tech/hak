import { StateListener } from '../../../src/state/StateListener';

describe('StateListener', () => {
  afterAll(() => jest.resetAllMocks());

  it('should listen for changes', async () => {
    const mockCallback = jest.fn();

    const state = { foo: 'bar', baz: 'qux', child: { sub: 'child value' } };

    const listener = new StateListener('top', ({ key, oldValue, newValue }) => {
      mockCallback(key, oldValue, newValue);
    });

    listener.setState(state);
    listener.setState({ foo: 'qux', baz: 'bar',  child: { sub: 'new child value' } });

    expect(mockCallback.mock.calls.length).toBe(3);
    expect(mockCallback.mock.calls[0]).toEqual(['top.foo', 'bar', 'qux']);
    expect(mockCallback.mock.calls[1]).toEqual(['top.baz', 'qux', 'bar']);
    expect(mockCallback.mock.calls[2]).toEqual(['top.child.sub', 'child value', 'new child value']);
  });
});
