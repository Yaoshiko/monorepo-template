#!/bin/bash

# Note: This script is intended to be run in a Docker container where secrets are mounted at /run/secrets.
#       It must be defined as a config in the Docker Swarm.

# Load all secrets matching /run/secrets/${PROJECT_NAME}_*
# For each file found, the part after ${PROJECT_NAME}_ will be used as the
# environment variable name (hyphens replaced with underscores).

set -euo pipefail

secrets_dir="/run/secrets"

if [ -z "${PROJECT_NAME:-}" ]; then
  echo "Error: PROJECT_NAME is not set. Please export PROJECT_NAME before running this script." >&2
  exit 1
fi

# Enable nullglob so the for-loop will skip if there are no matches
shopt -s nullglob

found=false
for file in "$secrets_dir/${PROJECT_NAME}_"*; do
  [ -f "$file" ] || continue
  found=true
  base=$(basename "$file")
  # Remove the PROJECT_NAME_ prefix
  secret_name=${base#${PROJECT_NAME}_}
  # Replace hyphens with underscores to produce a valid env var name
  env_name=${secret_name//-/_}

  # Export the secret value into the environment variable
  # Use printf to avoid trailing newlines issues when printing; do not print the secret value itself.
  export "$env_name"="$(< "$file")"
  echo "Secret loaded into \\$$env_name"
done

if [ "$found" = false ]; then
  echo "No secrets found matching $secrets_dir/${PROJECT_NAME}_*" >&2
fi

shopt -u nullglob
