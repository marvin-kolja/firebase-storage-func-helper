import type { ContentType } from './content_type'
import type { Config } from './config'
import { createPathMatcher, createContentTypeMatcher } from './matcher'

type FileMatchResult<
  PathTemplate extends string,
  ContentTypeParam extends ContentType,
> = {
  path: ReturnType<ReturnType<typeof createPathMatcher<PathTemplate>>>
  contentType: ReturnType<
    ReturnType<typeof createContentTypeMatcher<ContentTypeParam>>
  >
}

const createFileMatcher = <PathTemplate extends string, CT extends ContentType>(
  config: Config<PathTemplate, CT>,
) => {
  const matchPath = createPathMatcher(config.path)
  const matchContentType = createContentTypeMatcher(config.contentType)

  return (
    path: string | undefined,
    contentType: string | undefined,
  ): FileMatchResult<PathTemplate, CT> | false => {
    const pathMatchResult = matchPath(path)
    const contentTypeMatchResult = matchContentType(contentType)
    if (!pathMatchResult || !contentTypeMatchResult) {
      return false
    }

    return {
      path: pathMatchResult,
      contentType: contentTypeMatchResult,
    }
  }
}

export { createFileMatcher }
export type { FileMatchResult }
