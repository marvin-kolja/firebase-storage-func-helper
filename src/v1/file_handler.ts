import type { ContentType } from '../content_type'
import type { Config } from '../config'
import { createFileMatcher, FileMatchResult } from '../file_matcher'

import type { EventContext } from 'firebase-functions'
import { ObjectMetadata } from 'firebase-functions/v1/storage'

type HandlerV1<T> = (
  file: T,
  object: ObjectMetadata,
  context: EventContext,
) => void | Promise<void>

const createFileHandler = <
  PathTemplate extends string,
  ContentTypeParam extends ContentType,
  Min extends number,
  Max extends number,
>(
  opts: Config<PathTemplate, ContentTypeParam, Min, Max>,
) => {
  const fileMatcher = createFileMatcher(opts)

  type Handler = HandlerV1<
    FileMatchResult<PathTemplate, ContentTypeParam, Min, Max>
  >

  return (handler: Handler) => {
    return (object: ObjectMetadata, context: EventContext) => {
      const file = fileMatcher({
        path: object.name,
        contentType: object.contentType,
        size: parseInt(object.size),
      })
      if (!file) {
        return
      }
      return handler(file, object, context)
    }
  }
}

export { createFileHandler }
