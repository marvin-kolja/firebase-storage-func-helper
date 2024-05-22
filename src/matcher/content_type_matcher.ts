import type { ContentType, FlattenContentType } from '../content_type.ts'
import { getContentType } from '../content_type.js'

type ContentTypeMatchResult<ContentTypeParam extends ContentType> =
  FlattenContentType<ContentTypeParam>

const createContentTypeMatcher = <ContentTypeParam extends ContentType>(
  contentType: ContentTypeParam,
) => {
  return (type?: string): ContentTypeMatchResult<ContentTypeParam> | false => {
    if (!type) {
      return false
    }

    const match = getContentType(contentType, type)

    if (!match) {
      return false
    }

    return match
  }
}

export { createContentTypeMatcher }
export type { ContentTypeMatchResult }
