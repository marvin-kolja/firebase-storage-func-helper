import type { ContentType } from './content_type'
import type { Config } from './config'
import { createPathMatcher, createContentTypeMatcher } from './matcher'

type FileMatchResult<
  PathTemplate extends string,
  ContentTypeParam extends ContentType,
> = {
  path?: ReturnType<ReturnType<typeof createPathMatcher<PathTemplate>>>
  contentType?: ReturnType<
    ReturnType<typeof createContentTypeMatcher<ContentTypeParam>>
  >
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

  return (
    input: FileMatcherInput,
  ): FileMatchResult<PathTemplate, CT> | false => {
    const data = {
      path: matchers.path?.(input.path),
      contentType: matchers.contentType?.(input.contentType),
    }

    if (data.path === false || data.contentType === false) {
      return false
    }

    return data as FileMatchResult<PathTemplate, CT>
  }
}

export { createFileMatcher }
export type { FileMatchResult }
