#!/bin/sh
if [ ! -f "node_modules/.bin/sentry-cli" ]; then
	echo "Installing local sentry..."
	npm install @sentry/cli
fi

echo "Release version (x.x.x): "
read VERSION
node_modules/.bin/sentry-cli releases -o sideprojectguys -p bot-development files $VERSION upload-sourcemaps ./bin
