# 4. Hosting configuration

Date: 2024-05-22

## Status

Accepted

## Context

We need to set up hosting, so people can access the site.

## Decision

Utilize the following combination in other to have flexibility configuration:

- Namecheap for domain 
- Cloudflare for DNS and other features
- Analog is deployed to cloud run
- Firebase hosting in front of cloud run service

```
  "hosting": {
    "rewrites": [
      {
        "source": "**",
        "run": {
          "serviceId": "pdfun",
          "region": "us-central1"
        }
      }
    ]
  }
```

## Consequences

Firebase hosting is easy to set with free tier. Not sure about future authentication when we add to cloud run.
