import type { ContentType } from '../content_type'
import type { Config } from '../config'
import { createFileMatcher, FileMatchResult } from '../file_matcher'

import type { EventContext } from 'firebase-functions'
import { ObjectMetadata } from 'firebase-functions/v1/storage'

type HandlerV1<
  PathTemplate extends string,
  ContentTypeParam extends ContentType,
> = (
  file: FileMatchResult<PathTemplate, ContentTypeParam>,
  object: ObjectMetadata,
  context: EventContext,
) => void | Promise<void>

const createFileHandler = <
  PathTemplate extends string,
  ContentTypeParam extends ContentType,
>(
  opts: Config<PathTemplate, ContentTypeParam>,
) => {
  const fileMatcher = createFileMatcher(opts)

  return (handler: HandlerV1<PathTemplate, ContentTypeParam>) => {
    return (object: ObjectMetadata, context: EventContext) => {
      const file = fileMatcher(object.name, object.contentType)
      if (!file) {
        return
      }
      return handler(file, object, context)
    }
  }
}

export { createFileHandler }
