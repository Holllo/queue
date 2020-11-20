#!/usr/bin/env bash

set -e

required_commands=(
  "git"
  "yarn"
)

for cmd in ${required_commands[*]}; do
  if ! command -v "$cmd" &> /dev/null; then
    echo "Command \`$cmd\` could not be found and is required for this script to function."
    exit
  fi
done

echo "Cloning git repository"
echo "$ git clone 'https://github.com/Holllo/queue'"
git clone 'https://github.com/Holllo/queue'
echo

echo "Changing directory to the git repository"
echo "$ cd 'queue'"
cd 'queue'
echo

echo "Installing the dependencies"
echo "$ yarn --silent"
echo
yarn --silent
echo

echo "Building the extension"
echo "$ yarn build"
yarn build
echo

echo "Done! Check 'queue/build' for the output."
