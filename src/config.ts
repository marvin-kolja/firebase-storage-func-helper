import type { ContentType } from './content_type'

export type Config<
  PathTemplate extends string,
  ContentTypeParam extends ContentType,
> = {
  path?: PathTemplate
  contentType?: ContentTypeParam
}
