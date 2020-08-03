#!/bin/bash
# Use ./cleanup-docker-logs.sh <container_name> to clean up the log file of the specified container.

CONTAINER_NAME=$1
if [ -z "$CONTAINER_NAME" ]
then
  echo "ERROR: Please provide a container name!"
else
  CONTAINER_ID=$(docker inspect ${CONTAINER_NAME} | grep -Po '"Id": "([^"])+"' | cut -c8-71)
  [ -z "$CONTAINER_ID" ] && echo "ERROR: Could not find ${CONTAINER_NAME}!" && exit
  truncate -s 0 $(docker inspect --format='{{.LogPath}}' ${CONTAINER_NAME})
  echo "SUCCESS: Logs of ${CONTAINER_NAME} container have been cleared."
fi
