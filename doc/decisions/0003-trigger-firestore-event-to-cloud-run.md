# 3. Trigger Firestore event to Cloud Run

Date: 2024-05-20

## Status

Accepted

## Context

We we want to listen to an event where a document is created, so we can start to load the file and resize PDF file.

## Decision

- Utilize [Eventarc](https://cloud.google.com/eventarc/docs/run/route-trigger-cloud-firestore#gcloud)
- Create `firestore-trigger` service account to trigger cloud run. The path will be in the `ce-document` under the headers.

Example of event trigger

```
gcloud eventarc triggers create public-on-create-trigger \
    --location=nam5 \
    --destination-run-service=pdf-on-create \
    --destination-run-region=us-central1 \
    --event-filters="type=google.cloud.firestore.document.v1.created" \
    --event-filters="database=(default)" \
    --event-filters-path-pattern="document=public/{docId}" \
    --event-data-content-type="application/protobuf" \
    --service-account=firestore-trigger@pdfun-prod.iam.gserviceaccount.com
```

## Consequences

What becomes easier or more difficult to do and any risks introduced by the change that will need to be mitigated.
