#!/bin/sh
yarn

yarn build

docker build -t coinflow/convert-dashboard-web:dev .

docker login --username $DOCKER_ACCESS_NAME -p $DOCKER_ACCESS_TOKEN

docker push coinflow/convert-dashboard-web:dev
