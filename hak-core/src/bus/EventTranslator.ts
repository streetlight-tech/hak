import { EventBus } from './EventBus';
import { MapEventOptions } from './MapEventOptions';

/**
 * Provides an connector between two EventBus instances (or two references to the same EventBus) to
 * facilitate mapping of events from one bus to another.
 */
export class EventTranslator {
  source: EventBus;
  target: EventBus;

  /**
   * Creates a new instance of EventTranslator
   * @param source Source EventBus
   * @param target Target EventBus
   */
  constructor(source: EventBus, target: EventBus) {
    this.source = source;
    this.target = target;
  }

  /**
   * Maps an event from the source bus to the target bus
   * @param options Options
   */
  public mapEvent<TSource, TTarget>(options: MapEventOptions<TSource, TTarget>) {
    if (!options.targetPayload && !options.targetTransform) {
      throw Error('Either targetPayload or targetTransform must be specified');
    }

    if (options.targetPayload && options.targetTransform) {
      throw Error('Only specify targetPayload or targetTransform, not both');
    }

    this.source.addListener<TSource>(options.sourceEvent, (payload) => {
      if (!options.sourceFilter || options.sourceFilter(payload)) {
        if (options.targetPayload) {
          this.target.fireEvent(options.targetEvent, options.targetPayload);
        } else {
          const result = options.targetTransform(payload);
          const resultAsPromise = result as Promise<TTarget>;
          if (resultAsPromise?.then) {
            console.log('promise');
            resultAsPromise.then((targetPayload) => {
              this.target.fireEvent(options.targetEvent, targetPayload);
            });
          } else {
            this.target.fireEvent(options.targetEvent, result);
          }
        }
      }
    });
  }

  /**
   * Maps multipe events
   * @param maps Array of MapEventOptions
   */
  public mapEvents<TSource, TTarget>(maps: Array<MapEventOptions<TSource, TTarget>>) {
    maps.map(m => this.mapEvent(m));
  }
}
