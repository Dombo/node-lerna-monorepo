#!/bin/bash 
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null && pwd )"

docker-compose --file $SCRIPT_DIR/docker-compose.yml kill
docker-compose --file $SCRIPT_DIR/docker-compose.yml rm -f