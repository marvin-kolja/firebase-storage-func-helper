type ContentType = string | readonly string[]

type FlattenContentType<T extends ContentType> = T extends string
  ? T
  : T[number]

const isContentType = <ContentTypeParam extends ContentType>(
  contentType: ContentTypeParam,
  type: string,
): type is FlattenContentType<ContentTypeParam> => {
  if (Array.isArray(contentType)) {
    return contentType.includes(type)
  } else {
    return contentType === type
  }
}

export { isContentType }
export type { ContentType, FlattenContentType }
