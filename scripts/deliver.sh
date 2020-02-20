#!/usr/bin/env sh

set -x
npm run build
node code/bot.js &
sleep 1
echo $! > .pidfile
set +x