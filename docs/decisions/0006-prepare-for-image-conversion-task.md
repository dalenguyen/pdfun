# 6. Prepare for image conversion task

Date: 2024-06-06

## Status

Accepted

## Context

We need to add another feature that helps to convert PDF to images, so the current setup should support this new task.

## Decision

- Add taskType to the PDF documentation, so the backend know how to handle task
- Use taskType naming convention for naming the result

## Consequences

Having one cloud run service for resize and image conversion may cause bottleneck issue, but well, it's not something to worry about at this moment.
