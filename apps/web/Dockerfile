FROM node:23-slim AS builder

# Create non-root user.
WORKDIR /app

# Copy only built files and necessary runtime dependencies.
COPY ./package.json ./
COPY .env ./
COPY .output .output/

# Install tools if needed.
RUN npm install -g pino-pretty


EXPOSE 3000

# Load secrets.
ENTRYPOINT ["/bin/bash", "-c", "source /usr/local/bin/load-secrets.sh DB_PASSWORD BETTER_AUTH_SECRET RESEND_API_KEY && exec \"$@\"", "--"]

# Set the command to run the application.
CMD ["npm", "run", "start"]
