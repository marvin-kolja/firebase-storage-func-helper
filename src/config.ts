import type { ContentType } from './content_type'
import { SizeMatcherConfig } from './matcher/size_matcher'

export type Config<
  PathTemplate extends string | undefined,
  ContentTypeParam extends ContentType | undefined,
  Min extends number | undefined,
  Max extends number | undefined,
> = {
  path?: PathTemplate
  contentType?: ContentTypeParam
  size?: SizeMatcherConfig<Min, Max>
}
