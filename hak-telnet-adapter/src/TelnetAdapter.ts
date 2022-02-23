import { Telnet } from 'telnet-client';
import { TelnetAdapterOptions } from './TelnetAdaterOptions';
import { EventBus } from '../../hak-core/src/bus/EventBus';
import { ReadWriteDevice } from '../../hak-core/src/device/ReadWriteDevice';

export class TelnetAdapter {
  connection: Telnet;
  options: TelnetAdapterOptions;
  eventBus: EventBus;
  public isRunning: boolean;
  public readEvent: string;
  public writeEvent: string;
  public device: ReadWriteDevice<string>;

  constructor(options: TelnetAdapterOptions) {
    this.options = options;
    this.eventBus = options.eventBus;
    this.readEvent = options.readEvent;
    this.writeEvent = options.writeEvent;
    this.connection = new Telnet();
    this.device = new ReadWriteDevice<string>(this.eventBus, this.readEvent, this.writeEvent);
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

      this.eventBus.addListener(this.writeEvent, async (payload: string) => {
        this.send(payload);
      });

      this.readListener = this.readListener.bind(this);
      this.connection.on('data', this.readListener);

      await this.connect();

      await this.init();
    }
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

  public async send(command: string) {
    return this.connection.send(command);
  }

  private readListener(output: Buffer) {
    if (this.isRunning) {
      if (output) {
        this.eventBus.fireEvent<string>(this.readEvent, output.toString());
      }
    }
  }
}
