# Firestore Function Helper

The main goal of this package is to provide a simple way to only handle firebase storage files that meet specific criteria. Currently, those are the path and content type. It automatically checks those and will not call the provided handler if either of those are not met.

## Usage Example

Use the `createFileHandler` function to create a handler. It returns a function for each firebase cloud function version. If you're unsure which one you're using refer to their [docs](https://firebase.google.com/docs/functions/version-comparison).

The handler has the following configuration:

| Option      | Type                           | Description                                                                                            |
| ----------- | ------------------------------ | ------------------------------------------------------------------------------------------------------ |
| path        | `string`                       | The path the file needs to match. It can contain dynamic parameters such as `:userId` that are parsed. |
| contentType | `string  \| readonly string[]` | The content type/s of the file to handle.                                                              |

### V1

```typescript
// declare your handler
const onChatAttachmentHandler = createFileHandler({
  path: 'chats/:chatId/attachments/:attachmentId',
  contentType: ['video/mp4', 'video/quicktime'] as const, // If not `as const` it cannot infer the type
}).v1((file, object, context) => {
  const {
    params,
    contentType, // 'video/mp4' | 'video/quicktime'
  } = file

  const {
    chatId, // string
    attachmentId, // string
  } = params
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
// declare your handler
const onChatAttachmentHandler = createFileHandler({
  path: 'chats/:chatId/attachments/:attachmentId',
  contentType: ['video/mp4', 'video/quicktime'] as const, // If not `as const` it cannot infer the type
}).v2((file, event) => {
  const {
    params,
    contentType, // 'video/mp4' | 'video/quicktime'
  } = file

  const {
    chatId, // string
    attachmentId, // string
  } = params
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
