import type { StorageFile } from './file'
import type { ContentType } from './content_type'
import type { Config } from './config'
import { createFileMatcher } from './file_matcher'

import type { EventContext } from 'firebase-functions'
import type { StorageEvent } from 'firebase-functions/lib/v2/providers/storage'
import type { ObjectMetadata } from 'firebase-functions/lib/v1/providers/storage'

type HandlerV2<
  PathTemplate extends string,
  ContentTypeParam extends ContentType,
> = (
  file: StorageFile<PathTemplate, ContentTypeParam>,
  event: StorageEvent,
) => void | Promise<void>

type HandlerV1<
  PathTemplate extends string,
  ContentTypeParam extends ContentType,
> = (
  file: StorageFile<PathTemplate, ContentTypeParam>,
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

  return {
    v1: (handler: HandlerV1<PathTemplate, ContentTypeParam>) => {
      return (object: ObjectMetadata, context: EventContext) => {
        const file = fileMatcher(object.name, object.contentType)
        if (!file) {
          return
        }
        return handler(file, object, context)
      }
    },
    v2: (handler: HandlerV2<PathTemplate, ContentTypeParam>) => {
      return (event: StorageEvent) => {
        const file = fileMatcher(event.data.name, event.data.contentType)
        if (!file) {
          return
        }
        return handler(file, event)
      }
    },
  }
}

export { createFileHandler }
