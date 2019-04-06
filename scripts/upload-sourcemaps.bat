set /p version=Release version (x.x.x)?:
sentry-cli releases -o sideprojectguys -p bot-development files %version% upload-sourcemaps ./bin
