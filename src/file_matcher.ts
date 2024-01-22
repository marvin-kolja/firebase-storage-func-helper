import type { ContentType } from './content_type'
import type { Config } from './config'
import {
  createPathMatcher,
  createContentTypeMatcher,
  PathMatchResult,
  ContentTypeMatchResult,
} from './matcher'

type FileMatchResult<
  PathTemplate extends string | undefined,
  ContentTypeParam extends ContentType | undefined,
> = {
  path: PathTemplate extends string ? PathMatchResult<PathTemplate> : undefined
  contentType: ContentTypeParam extends ContentType
    ? ContentTypeMatchResult<ContentTypeParam>
    : undefined
}

type FileMatcherInput = {
  path: string | undefined
  contentType: string | undefined
}

const createFileMatcher = <PathTemplate extends string, CT extends ContentType>(
  config: Config<PathTemplate, CT>,
) => {
  const matchers = {
    path: config.path ? createPathMatcher(config.path) : undefined,
    contentType: config.contentType
      ? createContentTypeMatcher(config.contentType)
      : undefined,
  } as const

  type Result = FileMatchResult<PathTemplate, CT>

  return (input: FileMatcherInput): Result | false => {
    const data = {
      path: matchers.path?.(input.path),
      contentType: matchers.contentType?.(input.contentType),
    }

    if (data.path === false || data.contentType === false) {
      return false
    }

    return data as Result
  }
}

export { createFileMatcher }
export type { FileMatchResult }
