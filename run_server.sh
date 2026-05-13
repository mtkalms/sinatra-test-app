#!/bin/bash

source /usr/share/rvm/scripts/rvm

ARCH=$(uname -m)
if [[ "$ARCH" == "aarch64" || "$ARCH" == arm* ]]; then
    export LD_LIBRARY_PATH=/opt/oracle/instantclient_23_8
else
    export LD_LIBRARY_PATH=/opt/oracle/instantclient_23_4
fi

ruby app.rb
