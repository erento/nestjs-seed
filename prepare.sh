#!/bin/bash
set -e

echo '
#################################################################
#                                                               #
#  How to use it:                                               #
#  ./prepare.sh "order-state" "Order State" "<BUGSNAG-API-KEY>" #
#                                                               #
#################################################################
'

if [ "$1" == "" ] ; then
    echo "ERROR: Please specify slug of your service as first argument"
    exit 1
fi

SERVICE_SLUG="$1"

if [ "$2" == "" ] ; then
    echo "ERROR: Please specify name of your service as second argument"
    exit 1
fi

SERVICE_NAME="$2"

if [ "$3" == "" ] ; then
    echo "ERROR: Please specify name of your service as second argument"
    exit 1
fi

SERVICE_BUGSNAG_API_KEY="$3"

echo "service"
echo " - slug: "$SERVICE_SLUG
echo " - name:" $SERVICE_NAME
echo " - bugsnag API key:" $SERVICE_BUGSNAG_API_KEY

REPLACE_SLUG="x---service-slug---x"
REPLACE_NAME="x---service-name---x"
REPLACE_BUGSNAG_KEY="ba375572076032642b24bce412555761"

echo ""
echo "replacing slug:"
FILES=$(find . -type f ! -name 'prepare.sh' ! -wholename '*node_modules*' -print0 | xargs -0 grep -l "$REPLACE_SLUG")
echo ${FILES} | tr ' ' '\n'
echo ${FILES} | xargs sed -i "" -e "s/$REPLACE_SLUG/$SERVICE_SLUG/g"

echo ""
echo "replacing name:"
FILES=$(find . -type f ! -name 'prepare.sh' ! -wholename '*node_modules*' -print0 | xargs -0 grep -l "$REPLACE_NAME")
echo ${FILES} | tr ' ' '\n'
echo ${FILES} | xargs sed -i "" -e "s/$REPLACE_NAME/$SERVICE_NAME/g"

echo ""
echo "replacing bugsnag key:"
FILES=$(find . -type f ! -name 'prepare.sh' ! -wholename '*node_modules*' -print0 | xargs -0 grep -l "$REPLACE_BUGSNAG_KEY")
echo ${FILES} | tr ' ' '\n'
echo ${FILES} | xargs sed -i "" -e "s/$REPLACE_BUGSNAG_KEY/$SERVICE_BUGSNAG_API_KEY/g"

echo ""
echo "renaming deploy/kube files:"
mv deploy/kube/nestjs-controller.json "deploy/kube/$SERVICE_SLUG-controller.json"
mv deploy/kube/nestjs-service.json "deploy/kube/$SERVICE_SLUG-service.json"

rm README.md
mv _README.md README.md
SEED_GIT_HASH=$(git rev-parse HEAD)
rm -rf .git/
git init
git add .
git commit -am "Initial commit from seed project from commit hash: $SEED_GIT_HASH"

echo ""
echo "♥ Prepared ♥"
echo "- Add git remote and push it to the server"
