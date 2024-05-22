# Pdfun

PDF utilities

## Deploy image

```
./deploy.sh
```

## Deploy application

```
npx nx deploy pdf
```

## Local development

Run the following command to set the default credentials

```
gcloud auth application-default login
```

OR you create a new service account and use it locally

```
export GOOGLE_APPLICATION_CREDENTIALS="/home/user/Downloads/service-account-file.json"
```

## TODO

[] Improve deployment target for pdf app
[] Improve loading state
[] Add analytics
[] Add UI lib
