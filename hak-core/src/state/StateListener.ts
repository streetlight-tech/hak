import { StateChange } from './StateChange';

/* eslint-disable @typescript-eslint/no-explicit-any */
export class StateListener<T extends object> {
  private proxy: T;
  private key: string;
  private listener: (change: StateChange) => void;

  constructor(key: string, listener: (change: StateChange) => void) {
    this.key = key;
    this.listener = listener;
  }

  createProxy(key: string, state: any, listener: (change: StateChange) => void) {
    const proxy = new Proxy(state, {
      set: (target: T, p: string | symbol, value: any, receiver: T) => {
        const propName = p.toString();

        if (receiver[propName] && typeof receiver[propName] && receiver[propName] != value) {
          if (typeof receiver[propName] === 'object') {
            Object.assign(proxy[propName], value);
          } else {
            if (receiver[propName]) {
              listener({ key: `${key}.${propName}`, oldValue: receiver[propName], newValue: value });
            }
          }
        }
  
        target[propName] = value;
  
        return true;
      },
    });

    for (const prop in state) {
      if (typeof state[prop] === 'object') {
        proxy[prop] = this.createProxy(`${key}.${prop}`, state[prop], listener);
      }
    }

    return proxy;
  }

  setState(state: T) {
    if (this.proxy) {
      Object.assign(this.proxy, state);
    } else {
      this.proxy = this.createProxy(this.key, state, this.listener)
    }
  }
}
