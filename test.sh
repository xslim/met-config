#!/bin/sh

HOST="http://127.0.0.1:3000"

WS_ID="54eefa68004cec5efeb78d9f"

DATA=`curl -sL ${HOST}/websites/${WS_ID}`

WS_URL=`echo ${DATA} | jq -r '.url'`
WS_DEPTH=`echo ${DATA} | jq -r '.depth'`
WS_TOPN=`echo ${DATA} | jq -r '.topn'`
WS_EI=`echo ${DATA} | jq -r '.indexName'`
WS_REGEX=`echo ${DATA} | jq -r '.regex'`

echo "${WS_URL}: ${WS_DEPTH}/${WS_TOPN} @ ${WS_EI}\n${WS_REGEX}"
