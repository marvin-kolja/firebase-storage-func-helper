import type { Config } from '../config.ts'
import type { FileMatchResult } from '../file_matcher.ts'
import { createFileMatcher } from '../file_matcher.js'

import type { StorageEvent } from 'firebase-functions/v2/storage'

type HandlerV2<T> = (
  matchResult: T,
  event: StorageEvent,
) => void | Promise<void>

type V2StorageFunction = (event: StorageEvent) => void | Promise<void>

const createFileHandler = <T extends Config>(opts: T) => {
  const fileMatcher = createFileMatcher(opts)

  type Handler = HandlerV2<FileMatchResult<T>>

  return (handler: Handler): V2StorageFunction => {
    return (event: StorageEvent) => {
      const matchResult = fileMatcher({
        path: event.data.name,
        contentType: event.data.contentType,
        size: event.data.size,
      })
      if (!matchResult) {
        return
      }
      return handler(matchResult, event)
    }
  }
}

export { createFileHandler }
