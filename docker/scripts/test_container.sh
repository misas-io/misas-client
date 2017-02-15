#!/usr/bin/env bash

source './docker/scripts/common_container_utils.sh'
set -x
#run docker build process 
docker run --rm \
					 -v `pwd`/coverage/:/usr/src/app/coverage/ \
					 -v `pwd`/tests/:/usr/src/app/tests/ \
					 --env-file `name_misas_client_env_file` \
					 `gen_image_name` \
					 run test
