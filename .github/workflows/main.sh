#!/bin/bash
set -e

SCRIPT_DIR=$(cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd)

cd "$SCRIPT_DIR"
yarn install
yarn build
yarn eslint
yarn prettier
yarn test:single

cd "$SCRIPT_DIR/../../demos/angular-app"
yarn install
yarn build
yarn prettier
yarn test:single
