import { match } from 'path-to-regexp'

type ExtractRouteParams<Path extends string> = string extends Path
  ? Record<string, string>
  : Path extends `${infer Start}:${infer Param}/${infer Rest}`
    ? { [K in Param | keyof ExtractRouteParams<Rest>]: string }
    : Path extends `${infer Start}:${infer Param}`
      ? { [K in Param]: string }
      : {}

type PathMatchResult<T extends string> = {
  pathTemplate: T
  path: string
  params: ExtractRouteParams<T>
}

const createPathMatcher = <T extends string>(pathTemplate: T) => {
  const fn = match(pathTemplate, { decode: decodeURIComponent })
  return (filePath?: string): PathMatchResult<T> | false => {
    if (!filePath) {
      return false
    }

    const match = fn(filePath)
    if (!match) {
      return false
    }
    const { params } = match
    return {
      pathTemplate,
      path: filePath,
      params: params as ExtractRouteParams<T>,
    }
  }
}

export { createPathMatcher }
