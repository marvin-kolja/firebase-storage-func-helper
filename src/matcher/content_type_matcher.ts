import type { ContentType, FlattenContentType } from '../content_type'
import { isContentType } from '../content_type'

const createContentTypeMatcher = <ContentTypeParam extends ContentType>(
  contentType: ContentTypeParam,
) => {
  return (type?: string): FlattenContentType<ContentTypeParam> | false => {
    if (!type) {
      return false
    }

    if (!isContentType(contentType, type)) {
      return false
    }

    return contentType as FlattenContentType<ContentTypeParam>
  }
}

export { createContentTypeMatcher }
