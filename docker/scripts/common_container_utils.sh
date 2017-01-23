#!/usr/bin/env bash

MISAS_URL="ui.misas.io"
MISAS_PACKAGE="package.json"
MISAS_BASE="misas-client"

package_version(){
  cat "$MISAS_PACKAGE" | grep '"version"' | grep -o '\d\+\.\d\+\.\d\+' | head -1
}

gen_image_name(){
  if [ "$JOB_BASE_NAME" != "develop" -o "$JOB_BASE_NAME" != "master" ]; then
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

name_misas-client_env-file(){
  local ENV_FILE
  ENV_FILE=""
  if [ "$JOB_BASE_NAME" != "develop" -a "$JOB_BASE_NAME" != "master" ]; then
    echo "misas-client.io.env"
		return
  fi
  ENV_FILE="misas-client.io.${JOB_BASE_NAME}.env"
  echo "$ENV_FOLDER/$ENV_FILE"
}

load_misas-client_env-file(){
  local ENV_FILE
  ENV_FILE=""
  if [ "$JOB_BASE_NAME" != "develop" -a "$JOB_BASE_NAME" != "master" ]; then
    exit -1;
  fi
  ENV_FILE="misas-client.io.${JOB_BASE_NAME}.env"
  set +x
  while read env; do
    export $env
  done < "$ENV_FOLDER/$ENV_FILE"
  set -x
}

