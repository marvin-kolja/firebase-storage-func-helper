type ContentType = string | readonly string[]

type FlattenContentType<T extends ContentType> = T extends string
  ? T
  : T[number]

const getContentType = <ContentTypeParam extends ContentType>(
  contentType: ContentTypeParam,
  type: string,
): FlattenContentType<ContentTypeParam> | undefined => {
  if (Array.isArray(contentType)) {
    return contentType.find((ct) => ct === type)
  } else if (contentType === type) {
    return type as FlattenContentType<ContentTypeParam>
  }
  return undefined
}

export { getContentType }
export type { ContentType, FlattenContentType }
