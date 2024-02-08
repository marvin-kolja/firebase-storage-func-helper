import type { ContentType } from './content_type.ts'
import type { Config } from './config.ts'
import {
  createPathMatcher,
  createContentTypeMatcher,
  createSizeMatcher,
} from './matcher/index.js'
import type {
  PathMatchResult,
  ContentTypeMatchResult,
  SizeMatchResult,
  SizeMatcherConfig,
} from './matcher/index.ts'

type FileMatchResult<T extends Config = Config> = {
  path: T['path'] extends string ? PathMatchResult<T['path']> : undefined
  contentType: T['contentType'] extends ContentType
    ? ContentTypeMatchResult<T['contentType']>
    : undefined
  size: T['size'] extends SizeMatcherConfig<infer Min, infer Max>
    ? Min extends number
      ? SizeMatchResult
      : Max extends number
        ? SizeMatchResult
        : undefined
    : undefined
}

type FileMatcherInput = {
  path: string | undefined
  contentType: string | undefined
  size: number | undefined
}

const createFileMatcher = <T extends Config>(config: T) => {
  const matchers = {
    path: config.path ? createPathMatcher(config.path) : undefined,
    contentType: config.contentType
      ? createContentTypeMatcher(config.contentType)
      : undefined,
    size: config.size ? createSizeMatcher(config.size) : undefined,
  } as const

  type Result = FileMatchResult<T>

  return (input: FileMatcherInput): Result | false => {
    const data = {
      path: matchers.path?.(input.path),
      contentType: matchers.contentType?.(input.contentType),
      size: matchers.size?.(input.size),
    }

    if (
      data.path === false ||
      data.contentType === false ||
      data.size === false
    ) {
      return false
    }

    return data as Result
  }
}

export { createFileMatcher }
export type { FileMatchResult }
