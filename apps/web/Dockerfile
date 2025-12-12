FROM node:23-slim

# Install bash (for entrypoint) and gosu (for dropping privileges safely)
RUN apt-get update && \
    apt-get install -y --no-install-recommends bash gosu && \
    rm -rf /var/lib/apt/lists/*

# Create non-root user and group
RUN groupadd -r app && \
    useradd -r -g app -d /app -s /usr/sbin/nologin app

# Application directory
WORKDIR /app

# Copy only built files and necessary runtime dependencies.
COPY ./package.json ./
COPY .env ./
COPY .output .output/

# Install tools if needed.
RUN npm install -g pino-pretty


EXPOSE 3000

# Load secrets.
ENTRYPOINT ["/bin/bash", "-lc", "\
  source /usr/local/bin/load-secrets.sh; \
  chown -R app:app /app; \
  exec gosu app \"$@\" \
", "--"]

# Set the command to run the application.
CMD ["npm", "run", "start"]
