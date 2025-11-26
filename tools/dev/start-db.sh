#!/usr/bin/env bash


# Ensures that database container is up and running
function ensure_db_container {
    local container_name="$DB_CONTAINER"

    # Check if container exists
    if docker container inspect "$container_name" >/dev/null 2>&1; then
        # Container exists, check if it's running
        if [ -n "$(docker ps -q -f name="$container_name")" ]; then
            echo "Database container is already running."
        else
            echo "Database container exists but is stopped. Starting it now..."
            docker start "$container_name"
        fi
    else
        # Container doesn't exist, create it
        echo "Database container doesn't exist. Creating and starting it..."
        docker run \
            --name "$container_name" \
            -e POSTGRES_USER="$DB_USER" \
            -e POSTGRES_PASSWORD="$DB_PASSWORD" \
            -e POSTGRES_DB="$DB_NAME" \
            -p 5432:5432 \
            -d \
            postgres:latest
    fi
}

ensure_db_container
