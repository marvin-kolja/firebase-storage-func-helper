import type { ContentType } from '../content_type'
import type { Config } from '../config'
import { createFileMatcher, FileMatchResult } from '../file_matcher'

import type { StorageEvent } from 'firebase-functions/v2/storage'

type HandlerV2<
  PathTemplate extends string,
  ContentTypeParam extends ContentType,
> = (
  file: FileMatchResult<PathTemplate, ContentTypeParam>,
  event: StorageEvent,
) => void | Promise<void>

const createFileHandler = <
  PathTemplate extends string,
  ContentTypeParam extends ContentType,
>(
  opts: Config<PathTemplate, ContentTypeParam>,
) => {
  const fileMatcher = createFileMatcher(opts)

  return (handler: HandlerV2<PathTemplate, ContentTypeParam>) => {
    return (event: StorageEvent) => {
      const file = fileMatcher(event.data.name, event.data.contentType)
      if (!file) {
        return
      }
      return handler(file, event)
    }
  }
}

export { createFileHandler }
