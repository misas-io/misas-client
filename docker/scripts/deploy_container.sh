
#!/usr/bin/env bash

source './docker/scripts/common_container_utils.sh'
set -x
#run docker build process 
docker run --rm -v `gen_image_name` run s3_deploy 
