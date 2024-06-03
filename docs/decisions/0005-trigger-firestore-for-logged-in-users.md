# 5. trigger firestore for logged in users

Date: 2024-06-02

## Status

Accepted

## Context

We want a way to trigger event where a document is created for logged in users, so we can start the load the file and resize PDF files.

## Decision

- Utilize [Eventarc](https://cloud.google.com/eventarc/docs/run/route-trigger-cloud-firestore#gcloud)
- Create `firestore-trigger` service account to trigger cloud run. The path will be in the `ce-document` under the headers.

Example of event trigger

```
gcloud eventarc triggers create private-pdf-on-create-trigger \
    --location=nam5 \
    --destination-run-service=pdf-on-create \
    --destination-run-region=us-central1 \
    --event-filters="type=google.cloud.firestore.document.v1.created" \
    --event-filters="database=(default)" \
    --event-filters-path-pattern="document=users/{userId}/pdfs/{pdfId}" \
    --event-data-content-type="application/protobuf" \
    --service-account=firestore-trigger@pdfun-prod.iam.gserviceaccount.com
```

## Consequences

What becomes easier or more difficult to do and any risks introduced by the change that will need to be mitigated.
