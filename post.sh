#!/bin/sh
set -x

HOST="http://127.0.0.1:3000"
URL="${HOST}/websites/new"
FILE=$1

curl -vX POST -H "Content-Type: application/json" -d @${FILE} -i ${URL} 
