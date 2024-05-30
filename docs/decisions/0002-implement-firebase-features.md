# 2. Implement Firebase Features

Date: 2024-05-19

## Status

Accepted

## Context

We need a place to store user PDF files in order to run event trigger job and save data for the resize progress.

## Decision

- Utilize Firebase Storage for saving the files. It's publicly available under `PUBLIC` and time to live for 1 day.
- Save it under Firebase Firestore for retrieving updated data with time to live is also 1 day
- Add security rules for both firestore and cloud storage to enable the data to be access publicly

## Consequences

What becomes easier or more difficult to do and any risks introduced by the change that will need to be mitigated.
