#!/usr/bin/env bash

source './docker/scripts/common_container_utils.sh'
set -x
#run docker build process 
docker build -t `gen_image_name` ./
docker run --rm \
					 -v `pwd`/:/usr/src/app/ \
					 --env-file `name_misas-client_env-file` \
					 --entrypoint yarn \
					 `gen_image_name` install
