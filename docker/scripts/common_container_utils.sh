#!/usr/bin/env bash

MISAS_URL="ui.misas.io"
MISAS_PACKAGE="package.json"
MISAS_BASE="misas-client"

package_version(){
  cat "$MISAS_PACKAGE" | grep '"version"' | grep -o '\d\+\.\d\+\.\d\+' | head -1
}

gen_image_name(){
  if [ "$JOB_BASE_NAME" != "develop" -a "$JOB_BASE_NAME" != "master" ]; then
    echo "$MISAS_BASE:`package_version`_0"
    return
  fi
  if [ -z "${BUILD_NUMBER}" ]; then
    echo "Error: env variable BUILD_NUMBER required" 1>&2
    exit -1
  fi
  echo "$MISAS_BASE:`package_version`_${BUILD_NUMBER:-0}"
}

get_misas_env(){
  case "${JOB_BASE_NAME}" in
    develop)
      echo "development"
      ;;
    master)
      echo "production"
      ;;
    *)
      echo "ERROR: branch is not handled currently" 1>&2
      exit -1;
      ;;
  esac    # --- end of case ---
}

gen_aws_cli_image_name(){
  if [ -z "${AWS_CLI_DOCKER_IMAGE}" ]; then
    echo "victor755555/aws-cli"
    return;
  fi
  echo "$AWS_CLI_DOCKER_IMAGE"
}

gen_aws_s3_url(){
  if [ -z "${AWS_BUCKET_NAME}" ]; then
    echo "s3://fake.misas.io"
    return;
  fi
  echo "s3://$AWS_BUCKET_NAME"
}

gen_aws_cf_id(){
  if [ -z "${AWS_CLOUDFRONT_DIST_ID}" ]; then
    echo "zzzzzzzzzzzzz"
    return;
  fi
  echo "${AWS_CLOUDFRONT_DIST_ID}"
}

name_misas_client_env_file(){
  local ENV_FILE
  ENV_FILE=""
  if [ "$JOB_BASE_NAME" != "develop" -a "$JOB_BASE_NAME" != "master" ]; then
    echo "misas-client.io.env"
    return
  fi
  ENV_FILE="misas-client.io.${JOB_BASE_NAME}.env"
  echo "$ENV_FOLDER/$ENV_FILE"
}

name_misas_client_env_aws_dir(){
  local ENV_FILE
  ENV_FILE=""
  if [ "$JOB_BASE_NAME" != "develop" -a "$JOB_BASE_NAME" != "master" ]; then
    echo "`pwd`/misas-client.io.aws/"
    return
  fi
  ENV_FILE="misas-client.io.${JOB_BASE_NAME}.aws/"
  echo "$ENV_FOLDER/$ENV_FILE"
}

load_misas_client_env_file(){
  local ENV_FILE
  ENV_FILE=""
  if [ "$JOB_BASE_NAME" != "develop" -a "$JOB_BASE_NAME" != "master" ]; then
    ENV_FILE="misas-client.io.env"
  else
    ENV_FILE="misas-client.io.${JOB_BASE_NAME}.env"
  fi
  set +x
  while read env; do
    export $env
  done < "$ENV_FOLDER/$ENV_FILE"
  set -x
}

