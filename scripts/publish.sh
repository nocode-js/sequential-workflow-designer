#!/bin/bash

set -e

cd "$(dirname "${BASH_SOURCE[0]}")"

cd ../designer
yarn build
npm publish

cd ../react
yarn build
npm publish

cd ../svelte
yarn build
npm publish

cd ../angular
yarn build
cd ./designer-dist
npm publish
