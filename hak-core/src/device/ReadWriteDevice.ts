import { EventBus } from '../bus/EventBus';
import { EventTranslator } from '../bus/EventTranslator';

export class ReadWriteDevice {
  readTranslator: EventTranslator;
  writeTranslator: EventTranslator;

  constructor(readBus: EventBus, writeBus: EventBus) {
    this.readTranslator = new EventTranslator(readBus, writeBus);
    this.writeTranslator = new EventTranslator(writeBus, readBus);
  }
}
