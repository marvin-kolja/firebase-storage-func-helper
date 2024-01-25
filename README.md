# Firebase Storage Function Helper

The main goal of this package is to provide a simple way to only handle firebase storage files that meet specific criteria. Currently, those are the path and content type. It automatically checks those and will not call the provided handler if either of those are not met.

## Usage Example

Use the `createFileHandler` function to create a handler. Depending on the import it returns a function for either firebase cloud function version. If you're unsure which cloud function version you're using refer to their [docs](https://firebase.google.com/docs/functions/version-comparison).

The handler has the following configuration:

| Option                 | Type                             | Description                                                                                                                                                                     |
| ---------------------- | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| path (optional)        | `string`                         | The path the file needs to match. It can contain dynamic parameters such as `:userId` that are parsed.                                                                          |
| contentType (optional) | `string  \| readonly string[]`   | The content type/s of the file to handle.                                                                                                                                       |
| size (optional)        | `{ min?: number, max?: number }` | The min and max size that needs to match. One must be provided. <br/> An error is thrown when neither is provided or they are conflicting (negative or max is smaller then min) |

You can import the `createFileHandler` function from the `v1` or `v2` folder depending on which cloud function version you're using. The default entry point is `v2`.

### V1

```typescript
import { createFileHandler } from 'firebase-storage-func-helper/v1'
import { createFileHandler } from 'firebase-storage-func-helper/dist/v1'
```

```typescript
// declare your handler
const onChatAttachmentHandler = createFileHandler({
  path: 'chats/:chatId/attachments/:attachmentId',
  contentType: ['video/mp4', 'video/quicktime'] as const, // If not `as const` it cannot infer the type
  size: {
    min: 1 * 1024 * 1024, // 1 MB
    max: 10 * 1024 * 1024, // 10 MB
  },
})((matchResult, object, context) => {
  const {
    path,
    contentType, // 'video/mp4' | 'video/quicktime'
    size,
  } = matchResult

  const {
    chatId, // string
    attachmentId, // string
  } = path.params
})

// register your handler
export const onChatAttachment = firebaseFunctions
  .region('europe-west3')
  .storage.object()
  .onFinalize(onChatAttachmentHandler)

// for multiple handlers on the same function
// WARNING: you need to handle errors yourself here!
const onMultipleFile = firebaseFunctions
  .region('europe-west3')
  .storage.object()
  .onFinalize((object, context) => {
    onChatAttachmentHandler(object, context)
    onChatAttachmentHandler(object, context)
  })
```

### V2

```typescript
import { createFileHandler } from 'firebase-storage-func-helper'
import { createFileHandler } from 'firebase-storage-func-helper/v2'
import { createFileHandler } from 'firebase-storage-func-helper/dist/v2'
```

```typescript
// declare your handler
const onChatAttachmentHandler = createFileHandler({
  path: 'chats/:chatId/attachments/:attachmentId',
  contentType: ['video/mp4', 'video/quicktime'] as const, // If not `as const` it cannot infer the type
  size: {
    min: 1 * 1024 * 1024, // 1 MB
    max: 10 * 1024 * 1024, // 10 MB
  },
})((matchResult, event) => {
  const {
    path,
    contentType, // 'video/mp4' | 'video/quicktime'
    size,
  } = matchResult

  const {
    chatId, // string
    attachmentId, // string
  } = path.params
})

// register your handler
const onChatAttachment = onObjectFinalized(
  { bucket: 'test-bucket' },
  onChatAttachmentHandler,
)

// for multiple handlers on the same function
// WARNING: you need to handle errors yourself here!
const onMultipleFile = onObjectFinalized({ bucket: 'test-bucket' }, (event) => {
  onChatAttachmentHandler(event)
  onChatAttachmentHandler(event)
})
```
