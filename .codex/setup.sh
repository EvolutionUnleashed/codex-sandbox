#!/usr/bin/env bash
set -e

# Update package lists
sudo apt-get update

# Install Node.js and npm if not present
if ! command -v node >/dev/null 2>&1; then
  sudo apt-get install -y nodejs npm
fi

# Install Python 3 and pip
sudo apt-get install -y python3 python3-pip

# Install npm dependencies if package.json exists
if [ -f package.json ]; then
  npm install
fi

# Install Python dependencies if requirements.txt exists
if [ -f requirements.txt ]; then
  pip3 install -r requirements.txt
fi
