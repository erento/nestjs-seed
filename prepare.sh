#!/bin/bash
set -e

echo '
##############################################
#                                            #
#  How to use it:                            #
#  ./prepare.sh "order-state" "Order State"  #
#                                            #
##############################################
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

echo "service"
echo " - slug: "$SERVICE_SLUG
echo " - name:" $SERVICE_NAME

REPLACE_SLUG="x---service-slug---x"
REPLACE_NAME="x---service-name---x"

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
echo "♥ Prepared ♥"
echo "- Please remove already unnecessary script: rm prepare.sh"
