#!/bin/sh
yarn

yarn build:prod

docker build -t  coinflow/defi-admin:latest .

docker login --username $DOCKER_ACCESS_NAME -p $DOCKER_ACCESS_TOKEN


docker push coinflow/defi-admin:latest

