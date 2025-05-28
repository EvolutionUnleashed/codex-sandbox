# codex-sandbox
Sandbox repository for vibe coding sessions with ChatGPT Codex

## Setup

This repository includes a `.codex/setup.sh` script used by Codex environments. It installs common packages such as Node.js, npm, Python, and pip. If `package.json` or `requirements.txt` exist, the script installs dependencies using `npm install` or `pip3 install -r` respectively.


## Deployment

Deployment pipelines should configure application settings using environment variables rather than committing secrets to the repository. Any `.env*` files are ignored via `.gitignore`, so define variables like `PORT` or `API_KEY` directly in your pipeline configuration.

