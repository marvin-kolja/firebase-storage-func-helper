# Firestore Function Helper

# Usage Example

## V1

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

## V2

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
