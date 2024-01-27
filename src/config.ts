import type { ContentType } from './content_type'
import { SizeMatcherConfig } from './matcher/size_matcher'

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
