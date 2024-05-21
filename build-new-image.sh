# enable to printout full logs
set -x

# Fail on any error.
set -eo pipefail

# Case statement to pull in inputs
while true; do
  case "$1" in
    -d|--dir)
      dir="$2"
      shift 2;;
    -s|--image)
      image="$2"
      shift 2;;
    -b|--buildId)
      buildId="$2"
      shift
      break;;
     *)
      break;;
  esac
done
# 20220703r0 or 20220703.local-Dale
buildNumber=${BUILD_NUMBER:-$(date +'%Y%m%d')'.local-'$(git config --global user.name | tr -d ' ' |  tr '[:upper:]' '[:lower:]' )}
buildId=${buildId:-$buildNumber}

GCLOUD_PROJECT="pdfun-prod"
REGION="us-central1"
REPO="pdf"

imageTag=${REGION}-docker.pkg.dev/$GCLOUD_PROJECT/$REPO/$image


# set the dir where the command will run
dir=$dir
echo "dir: $dir image: $image project: $GCLOUD_PROJECT buildId: $buildId"

# Build the image locally
(cd $dir && docker build -t $imageTag -f Dockerfile --platform linux/x86_64 .)

# Push it to Artifact Registry:
docker push $imageTag

