
#!/usr/bin/env bash

source './docker/scripts/common_container_utils.sh'
set -x
#run docker build process 
docker run --rm \
					 -v `pwd`/:/usr/src/app/ \
					 --env-file `name_misas_client_env_file` \
					 `gen_image_name` run build:prod
