import { StateChange } from './StateChange';

/* eslint-disable @typescript-eslint/no-explicit-any */
export class StateMonitor<T extends object> {
  private proxy: T;
  private listener: (change: StateChange) => void;

  constructor(listener: (change: StateChange) => void) {
    this.listener = listener;
  }

  private createProxy(state: any, listener: (change: StateChange) => void, key?: string) {
    const proxy = new Proxy(state, {
      set: (target: T, p: string | symbol, value: any, receiver: T) => {
        const propName = p.toString();

        if (receiver[propName] && typeof receiver[propName] && receiver[propName] != value) {
          if (typeof receiver[propName] === 'object') {
            Object.assign(proxy[propName], value);
          } else {
            if (receiver[propName]) {
              listener({
                key: StateMonitor.createFullKey(key, propName),
                oldValue: receiver[propName],
                newValue: value,
              });
            }
          }
        }

        target[propName] = value;

        return true;
      },
    });

    for (const prop in state) {
      if (typeof state[prop] === 'object') {
        proxy[prop] = this.createProxy(state[prop], listener, StateMonitor.createFullKey(key, prop));
      }
    }

    return proxy;
  }

  private static createFullKey(key: string, nextKey: string) {
    return key ? `${key}.${nextKey}` : nextKey;
  }

  setState(state: T) {
    if (this.proxy) {
      Object.assign(this.proxy, state);
    } else {
      this.proxy = this.createProxy(state, this.listener);
    }
  }
}
