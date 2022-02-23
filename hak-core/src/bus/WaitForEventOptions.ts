export interface WaitForEventOptions<T> {
  event: string;
  timeout: number;
  filter?: (payload: T) => boolean;
  before?: () => void;
  after?: () => void;
}
