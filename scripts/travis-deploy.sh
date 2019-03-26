#! /bin/sh

set -xe

# Update this whenever the latest Node.js LTS version changes (~ every year).
# Do not forget to add this version to .travis.yml config also.
LATEST_LTS_VERSION="10"

# We want this command to succeed whether or not the Node.js version is the
# latest (so that the build does not show as failed), but _only_ the latest
# should be used to publish the module.
if [ "$TRAVIS_NODE_VERSION" != "$LATEST_LTS_VERSION" ]; then
  echo "Node.js v$TRAVIS_NODE_VERSION is not latest LTS version -- will not deploy with this version."
  exit 0
fi

# Ensure the tag matches the one in package.json, otherwise abort.
VERSION="$(jq -r .version package.json)"
PACKAGE_TAG=v"$VERSION"

if [[ "$PACKAGE_TAG" != "$TRAVIS_TAG" ]]; then
  echo "Travis tag (\"$TRAVIS_TAG\") is not equal to package.json tag (\"$PACKAGE_TAG\"). Please push a correct tag and try again."
  exit 1
fi

# Publish the npm module
npm publish

IMAGE_NAME="dashpay/insight"

MAJOR_VERSION="$( cut -d '.' -f 1 <<< "$VERSION" )"

# Build Docker image
docker build -t "${IMAGE_NAME}:latest" \
             -t "${IMAGE_NAME}:${VERSION}" \
             --build-arg "MAJOR_VERSION=${MAJOR_VERSION}" \
             --build-arg "VERSION=${VERSION}" \
             .

# Login to Docker Hub
echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin

# Push images to the registry
docker push "${IMAGE_NAME}:latest"
docker push "${IMAGE_NAME}:${VERSION}"
