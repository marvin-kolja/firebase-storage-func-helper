import type { ContentType } from './content_type'

export type Config<
  PathTemplate extends string | undefined,
  ContentTypeParam extends ContentType | undefined,
> = {
  path?: PathTemplate
  contentType?: ContentTypeParam
}
