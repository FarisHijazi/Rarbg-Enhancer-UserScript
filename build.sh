#!/bin/bash
./script-version-increment.sh Rarbg-Enhancer-UserScript.user.js && \
  git push && \
  git push --tags
