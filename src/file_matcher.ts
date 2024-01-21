import type { ContentType, FlattenContentType } from './content_type'
import type { Config } from './config'
import type { StorageFile } from './file'
import { pathMatcher } from './path/path_matcher'
import { contentTypeMatcher } from './content_type'

type FileMatchResult<
  PathTemplate extends string,
  CT extends ContentType,
> = StorageFile<PathTemplate, CT>

const createFileMatcher = <PathTemplate extends string, CT extends ContentType>(
  config: Config<PathTemplate, CT>,
) => {
  const matchPath = pathMatcher(config.path)
  const matchContentType = contentTypeMatcher(config.contentType)

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
