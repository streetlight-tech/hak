import { Telnet } from 'telnet-client';
import { TelnetAdapterOptions } from './TelnetAdaterOptions';
import { EventBus } from '../../hak-core/src/bus/EventBus';
import { LocalEventBus } from '../../hak-core/src/bus/LocalEventBus';
import { ReadWriteDevice } from '../../hak-core/src/device/ReadWriteDevice';

export class TelnetAdapter {
  connection: Telnet;
  options: TelnetAdapterOptions;
  eventBus: EventBus;
  readEvent: string;
  writeEvent: string;
  public isRunning: boolean;
  public device: ReadWriteDevice;

  constructor(options: TelnetAdapterOptions) {
    this.options = options;
    this.eventBus = options.eventBus;
    this.readEvent = options.readEvent;
    this.writeEvent = options.writeEvent;
    this.connection = new Telnet();
    this.connection.on('send', this.send);
    this.device = new ReadWriteDevice(new LocalEventBus(this.connection), this.eventBus);
  }

  public async connect() {
    const { host, port, timeout } = this.options;
    return this.connection.connect({
      host,
      port: port ?? 23,
      timeout: timeout ?? 5000,
      negotiationMandatory: false,
    });
  }

  public async start() {
    if (!this.isRunning) {
      this.isRunning = true;

      await this.connect();

      await this.init();
    }
  }

  public mapData<T>(event: string, listener: (payload: T) => T) {
    this.device.readTranslator.mapEvent({
      sourceEvent: 'data',
      targetEvent: event,
      targetTransform: listener,
    })
  }

  public async stop() {
    this.isRunning = false;

    return this.connection?.end();
  }

  public async init() {
    const initCommands = this.options.initCommands ?? [];
    await Promise.all(
      initCommands.map(async (c) => {
        await this.send(c);
      }),
    );
  }

  public async send<T>(payload: T) {
    return this.device.writeTranslator.source.fireEvent(this.writeEvent, payload);
  }
}
