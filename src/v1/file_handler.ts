import type { Config } from '../config'
import { createFileMatcher, FileMatchResult } from '../file_matcher'

import type { EventContext } from 'firebase-functions'
import { ObjectMetadata } from 'firebase-functions/v1/storage'

type HandlerV1<T> = (
  matchResult: T,
  object: ObjectMetadata,
  context: EventContext,
) => void | Promise<void>

const createFileHandler = <T extends Config>(opts: T) => {
  const fileMatcher = createFileMatcher(opts)

  type Handler = HandlerV1<FileMatchResult<T>>

  return (handler: Handler) => {
    return (object: ObjectMetadata, context: EventContext) => {
      const matchResult = fileMatcher({
        path: object.name,
        contentType: object.contentType,
        size: parseInt(object.size),
      })
      if (!matchResult) {
        return
      }
      return handler(matchResult, object, context)
    }
  }
}

export { createFileHandler }
