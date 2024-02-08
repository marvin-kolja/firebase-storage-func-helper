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

You can get the `createFileHandler` function from the exported `v1` or `v2`.

### V1

```typescript
import { v1 } from 'firebase-storage-func-helper'
```

```typescript
// declare your handler
const onChatAttachmentHandler = v1.createFileHandler({
  path: 'chats/:chatId/attachments/:attachmentId',
  contentType: ['video/mp4', 'video/quicktime'],
  size: {
    min: 1 * 1024 * 1024, // 1 MB
    max: 10 * 1024 * 1024, // 10 MB
  },
  // If no `as const` it cannot infer the types for `matchResult`
} as const)((matchResult, object, context) => {
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
import { v2 } from 'firebase-storage-func-helper'
```

```typescript
// declare your handler
const onChatAttachmentHandler = v2.createFileHandler({
  path: 'chats/:chatId/attachments/:attachmentId',
  contentType: ['video/mp4', 'video/quicktime'],
  size: {
    min: 1 * 1024 * 1024, // 1 MB
    max: 10 * 1024 * 1024, // 10 MB
  },
  // If no `as const` it cannot infer the types for `matchResult`
} as const)((matchResult, event) => {
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
