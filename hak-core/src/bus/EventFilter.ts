export interface EventFilter<T> {
  event: string;
  filter?: (payload: T) => boolean;
}
