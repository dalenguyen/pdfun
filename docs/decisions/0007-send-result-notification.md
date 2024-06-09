# 7. Send result notification

Date: 2024-06-08

## Status

Accepted

## Context

We need a way to show how many users using the product

## Decision

Create an analytic collection to indicate the metadata. For example:

```
analytics {
  type: RESIZE | IMAGE_CONVERSION | CHAT
  fileSize: number
  newFileSize: number
  createdAt: string
  user: string (anonymous / uid)
  numberOfImages: number
}

```

## Consequences

What becomes easier or more difficult to do and any risks introduced by the change that will need to be mitigated.
