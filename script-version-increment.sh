#!/bin/sh

GIT_VERSION=$(git describe --abbrev=0 --tags 2>/dev/null)
GIT_VERSION=${GIT_VERSION:-'0.0.0'}


VERSION_LINE=$(grep "@version" "${1}")
VERSION="${VERSION_LINE##* }"

if [ "${GIT_VERSION}" != "v${VERSION}" ]; then
    echo "ERROR: Git version ($GIT_VERSION) not matching with script version (v$VERSION), exiting ..."
    exit 1
fi

#Get number parts
MAJOR="${VERSION%%.*}"; VERSION="${VERSION#*.}"
MINOR="${VERSION%%.*}"; VERSION="${VERSION#*.}"
PATCH="${VERSION%%.*}"; VERSION="${VERSION#*.}"
#Increase version
PATCH=$((PATCH+1))

NEW_TAG="$MAJOR.$MINOR.$PATCH"
VERSION="${VERSION_LINE##* }"
prefix="\/\/ @version      "
cp "${1}" "${1}.bak"
sed -i "s/\/\/ @version *${VERSION}/${prefix}${NEW_TAG}/" "${1}"

./gittag-increment.sh
git commit "${1}" --amend -m "Bump version to ${NEW_TAG} for ${1}"
