
#!/usr/bin/env bash

source './docker/scripts/common_container_utils.sh'
set -x
set -e
#run docker build process 
docker run --rm \
					 --env-file `name_misas_client_env_file` \
					 `gen_image_name` run build:prod
docker rmi `gen_image_name`
