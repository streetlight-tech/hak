export interface MapEventOptions<TSource, TTarget> {
  sourceEvent: string;
  sourceFilter?: (payload: TSource) => boolean;
  targetEvent: string;
  targetPayload?: TTarget;
  targetTransform?: ((payload: TSource) => TTarget) | ((payload: TSource) => Promise<TTarget>);
}
