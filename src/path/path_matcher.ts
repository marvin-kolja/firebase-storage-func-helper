import type { ExtractRouteParams } from './extract_params'
import { match } from 'path-to-regexp'

const createPathMatcher = <T extends string>(pathTemplate: T) => {
  const fn = match(pathTemplate, { decode: decodeURIComponent })
  return (filePath?: string) => {
    if (!filePath) {
      return null
    }

    const match = fn(filePath)
    if (!match) {
      return null
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
