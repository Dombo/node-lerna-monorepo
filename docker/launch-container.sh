#!/bin/bash 
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null && pwd )"

$SCRIPT_DIR/build-container.sh && $SCRIPT_DIR/run-container.sh && $SCRIPT_DIR/ssh-container.sh