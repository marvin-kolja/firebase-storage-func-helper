import type { ContentType } from '../content_type'
import type { Config } from '../config'
import { createFileMatcher, FileMatchResult } from '../file_matcher'

import type { StorageEvent } from 'firebase-functions/v2/storage'

type HandlerV2<T> = (file: T, event: StorageEvent) => void | Promise<void>

const createFileHandler = <
  PathTemplate extends string | undefined,
  ContentTypeParam extends ContentType | undefined,
  Min extends number | undefined,
  Max extends number | undefined,
>(
  opts: Config<PathTemplate, ContentTypeParam, Min, Max>,
) => {
  const fileMatcher = createFileMatcher(opts)

  type Handler = HandlerV2<
    FileMatchResult<PathTemplate, ContentTypeParam, Min, Max>
  >

  return (handler: Handler) => {
    return (event: StorageEvent) => {
      const file = fileMatcher({
        path: event.data.name,
        contentType: event.data.contentType,
        size: event.data.size,
      })
      if (!file) {
        return
      }
      return handler(file, event)
    }
  }
}

export { createFileHandler }
