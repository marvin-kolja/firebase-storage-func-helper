import type { ExtractRouteParams } from './path/extract_params'
import type { ContentType, FlattenContentType } from './content_type'

type StorageFile<PathTemplate extends string, CT extends ContentType> = {
  path: string
  contentType: FlattenContentType<CT>
  pathTemplate: PathTemplate
  params: ExtractRouteParams<PathTemplate>
}

export type { StorageFile }
