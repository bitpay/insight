#!/bin/bash
set -ex
CONFIG_PATH="$REDDCOIN_DATA/reddcoin.conf"

if [ ! -f "$CONFIG_PATH" ]; then
  echo "server=$RPC_SERVER" >> $CONFIG_PATH
  echo "rpcuser=$RPC_USERNAME" >> $CONFIG_PATH
  echo "rpcpassword=$RPC_PASSWORD" >> $CONFIG_PATH
  echo "rpcport=$RPC_PORT" >> $CONFIG_PATH
  echo "rpcallowip=$RPC_ALLOW_IP" >> $CONFIG_PATH
  echo "printtoconsole=1" >> $CONFIG_PATH
fi

if [ -f "/root/bootstrap/bootstrap050120.zip" ]; then
  if [ -d "$REDDCOIN_DATA/blocks" ]; then
    echo "Skipping Bootstrap file cause of already existent blocks in $REDDCOIN_DATA"
  else
    cd "$REDDCOIN_DATA" && rm -rf blocks chainstate database
    apt-get update && apt-get install -y unzip
    unzip /root/bootstrap/bootstrap050120.zip -d $REDDCOIN_DATA
    chown -R reddcoin "$REDDCOIN_DATA"
  fi
fi

[ -f "$REDDCOIN_DATA/.lock" ] && rm -f $REDDCOIN_DATA/.lock

reddcoind -datadir="$REDDCOIN_DATA"