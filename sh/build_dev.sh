#!/bin/sh
yarn

yarn build:pro

docker build -t  coinflow/bsc-sp-swap-web:dev .

docker login --username $DOCKER_ACCESS_NAME -p $DOCKER_ACCESS_TOKEN


docker push  coinflow/bsc-sp-swap-web:dev 