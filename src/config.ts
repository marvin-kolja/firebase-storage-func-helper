import type { ContentType } from './content_type.ts'
import type { SizeMatcherConfig } from './matcher/size_matcher.ts'

export type Config<
  PathTemplate extends string | undefined = string,
  ContentTypeParam extends ContentType | undefined = ContentType,
  Min extends number | undefined = number,
  Max extends number | undefined = number,
> = {
  path?: PathTemplate
  contentType?: ContentTypeParam
  size?: SizeMatcherConfig<Min, Max>
}
