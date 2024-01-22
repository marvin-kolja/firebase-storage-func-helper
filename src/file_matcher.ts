import type { ContentType } from './content_type'
import type { Config } from './config'
import {
  createPathMatcher,
  createContentTypeMatcher,
  createSizeMatcher,
  PathMatchResult,
  ContentTypeMatchResult,
  SizeMatchResult,
} from './matcher'

type FileMatchResult<
  PathTemplate extends string | undefined,
  ContentTypeParam extends ContentType | undefined,
  Min extends number | undefined,
  Max extends number | undefined,
> = {
  path: PathTemplate extends string ? PathMatchResult<PathTemplate> : undefined
  contentType: ContentTypeParam extends ContentType
    ? ContentTypeMatchResult<ContentTypeParam>
    : undefined
  size: Min extends number
    ? SizeMatchResult
    : Max extends number
      ? SizeMatchResult
      : undefined
}

type FileMatcherInput = {
  path: string | undefined
  contentType: string | undefined
  size: number | undefined
}

const createFileMatcher = <
  PathTemplate extends string | undefined,
  CT extends ContentType | undefined,
  Min extends number | undefined,
  Max extends number | undefined,
>(
  config: Config<PathTemplate, CT, Min, Max>,
) => {
  const matchers = {
    path: config.path ? createPathMatcher(config.path) : undefined,
    contentType: config.contentType
      ? createContentTypeMatcher(config.contentType)
      : undefined,
    size: config.size ? createSizeMatcher(config.size) : undefined,
  } as const

  type Result = FileMatchResult<PathTemplate, CT, Min, Max>

  return (input: FileMatcherInput): Result | false => {
    const data = {
      path: matchers.path?.(input.path),
      contentType: matchers.contentType?.(input.contentType),
      size: matchers.size?.(input.size),
    }

    if (
      data.path === false ||
      data.contentType === false ||
      data.size === false
    ) {
      return false
    }

    return data as Result
  }
}

export { createFileMatcher }
export type { FileMatchResult }
