import { EventBus } from './bus/EventBus';

export class Engine {
  eventBus: EventBus;

  constructor(eventBus: EventBus) {
    this.eventBus = eventBus;
  }
}
