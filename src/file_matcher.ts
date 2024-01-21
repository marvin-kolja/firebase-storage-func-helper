import type { ContentType, FlattenContentType } from './content_type'
import type { Config } from './config'
import type { StorageFile } from './file'
import { createPathMatcher } from './path/path_matcher'
import { createContentTypeMatcher } from './content_type'

type FileMatchResult<
  PathTemplate extends string,
  CT extends ContentType,
> = StorageFile<PathTemplate, CT>

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
    if (pathMatchResult === null || !matchContentType(contentType)) {
      return false
    }

    return {
      pathTemplate: pathMatchResult.pathTemplate,
      path: pathMatchResult.path,
      params: pathMatchResult.params,
      contentType: contentType as FlattenContentType<CT>,
    }
  }
}

export { createFileMatcher }
export type { FileMatchResult }
