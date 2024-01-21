type ExtractRouteParams<Path extends string> = string extends Path
  ? Record<string, string>
  : Path extends `${infer Start}:${infer Param}/${infer Rest}`
    ? { [K in Param | keyof ExtractRouteParams<Rest>]: string }
    : Path extends `${infer Start}:${infer Param}`
      ? { [K in Param]: string }
      : {}

export type { ExtractRouteParams }
