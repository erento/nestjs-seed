#!/bin/bash
set -e

SCRIPTNAME=${0##*/}

echo " - jest version:" $(./node_modules/.bin/jest --version || { echo "$SCRIPTNAME: jest is not available"; exit 1; })
echo " - nodemon version:" $(./node_modules/.bin/nodemon --version || { echo "$SCRIPTNAME: nodemon is not available"; exit 1; })

if [ "$1" = "" ]; then
    echo "You need to pass a command to run."
    exit 1
fi

if [ "$1" != "jest" ] && [ "$1" != "dev-server" ]; then
    echo "An argument for the command has invalid value '$1'. Available options: jest, dev-server."
    exit 1
fi

ENV_VALUE=""

if [ "$1" = "jest" ]; then
    ENV_VALUE="test"
    CMD="./node_modules/.bin/jest"

    if [ "$2" = "--watch" ]; then
        CMD="./node_modules/.bin/jest --watch"
    fi
fi

if [ "$1" = "dev-server" ]; then
    CMD="./node_modules/.bin/nodemon index.js"
fi
# No need for GCLOUD_PROJECT variable in beta/prod (only locally or outside of GCP)
GCLOUD_PROJECT="x---gcloud-project---x" \
    $CMD
