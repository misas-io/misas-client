#!/usr/bin/env bash

source './docker/scripts/common_container_utils.sh'
load_misas_client_env_file
set -x
set -e
echo "removing s3 files from bucket"
docker run --rm \
           -v `name_misas_client_env_aws_dir`:/root/.aws/ \
           `gen_aws_cli_image_name` s3 rm `gen_aws_s3_url`/ --recursive 
echo "syncing s3 files to bucket"
docker run --rm \
           --env-file `name_misas_client_env_file` \
           -v `name_misas_client_env_aws_dir`:/root/.aws/ \
           -v `pwd`/dist/:/project/ \
           `gen_aws_cli_image_name` s3 sync . `gen_aws_s3_url`/ \
           --exclude "*" \
           --include "index.html" \
           --acl "public-read" \
           --cache-control "no-cache,max-age=1296000"
docker run --rm \
           --env-file `name_misas_client_env_file` \
           -v `name_misas_client_env_aws_dir`:/root/.aws/ \
           -v `pwd`/dist/:/project/ \
           `gen_aws_cli_image_name` s3 sync . `gen_aws_s3_url`/ \
           --exclude "index.html" \
           --acl "public-read" \
           --cache-control "max-age=1296000"
echo "invalidating cloudfront"
docker run --rm \
           --env-file `name_misas_client_env_file` \
           -v `name_misas_client_env_aws_dir`:/root/.aws/ \
           `gen_aws_cli_image_name` cloudfront create-invalidation --distribution-id `gen_aws_cf_id` --paths '/*'
