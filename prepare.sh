#!/bin/bash
set -e

echo '
################################################################################################
#                                                                                              #
#  How to use it:                                                                              #
#  ./prepare.sh "order-state" "Order State" "<BUGSNAG-API-KEY>" "<PROJECT>" "<GCLOUD-PROJECT>" #
#  Project can be erento or campanda                                                           #
################################################################################################
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
    echo "ERROR: Please specify name of your service as third argument"
    exit 1
fi

SERVICE_BUGSNAG_API_KEY="$3"

if [ "$4" == "" ] ; then
    echo "ERROR: Please specify name of your project as fourth argument"
    exit 1
fi
if [ "$4" != "erento"  || "$4" != "campanda"] ; then
    echo "ERROR: Project name has to be erento or campanda"
    exit 1
fi

PROJECT = "$4"

GCLOUD_PROJECT="$5"

echo "service"
echo " - slug: "$SERVICE_SLUG
echo " - name:" $SERVICE_NAME
echo " - bugsnag API key:" $SERVICE_BUGSNAG_API_KEY
echo " - GCloud Project:" $GCLOUD_PROJECT

REPLACE_SLUG="x---service-slug---x"
REPLACE_NAME="x---service-name---x"
REPLACE_BUGSNAG_KEY="ba375572076032642b24bce412555761"
REPLACE_GCLOUD_PROJECT="x---gcloud-project---x"

echo ""
echo "replacing slug:"
FILES=$(find . -type f ! -name 'prepare.sh' ! -wholename '*node_modules*' -print0 | xargs -0 grep -l "$REPLACE_SLUG")
echo ${FILES} | tr ' ' '\n'
echo ${FILES} | xargs sed -i".bak" -e "s/$REPLACE_SLUG/$SERVICE_SLUG/g"

echo ""
echo "replacing name:"
FILES=$(find . -type f ! -name 'prepare.sh' ! -wholename '*node_modules*' -print0 | xargs -0 grep -l "$REPLACE_NAME")
echo ${FILES} | tr ' ' '\n'
echo ${FILES} | xargs sed -i".bak" -e "s/$REPLACE_NAME/$SERVICE_NAME/g"

echo ""
echo "replacing bugsnag key:"
FILES=$(find . -type f ! -name 'prepare.sh' ! -wholename '*node_modules*' -print0 | xargs -0 grep -l "$REPLACE_BUGSNAG_KEY")
echo ${FILES} | tr ' ' '\n'
echo ${FILES} | xargs sed -i".bak" -e "s/$REPLACE_BUGSNAG_KEY/$SERVICE_BUGSNAG_API_KEY/g"

echo ""
echo "replacing gcloud project:"
FILES=$(find . -type f ! -name 'prepare.sh' ! -wholename '*node_modules*' -print0 | xargs -0 grep -l "$REPLACE_GCLOUD_PROJECT")
echo ${FILES} | tr ' ' '\n'
echo ${FILES} | xargs sed -i".bak" -e "s/$REPLACE_GCLOUD_PROJECT/$GCLOUD_PROJECT/g"

echo ""
echo "cleaning .bak files"
find . -name "*.bak" -delete

rm README.md
mv _README.md README.md
SEED_GIT_HASH=$(git rev-parse HEAD)
rm -rf .git/
rm -rf prepare.sh
git init
git add .
git commit -am "Initial commit from seed project from commit hash: $SEED_GIT_HASH"

if [ PROJECT == "campanda" ] ; then
    rm Jenkinsfile
    mv CampandaJenkinsfile Jenkinsfile
    rm -rf ./deploy
    mv ./campanda-deploy ./deploy
fi

if [ PROJECT == "erento" ] ; then
    rm CampandaJenkinsfile
    rm -rf ./campanda-deploy
fi

echo ""
echo "♥ Prepared ♥"
echo "- Add git remote and push it to the server"
