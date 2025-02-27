# Use a minimal base image
FROM node:20-alpine AS builder

# Set a working directory
WORKDIR /app

# Ensure deterministic builds
ENV NODE_ENV=static
ENV NEXT_TELEMETRY_DISABLED=1
ENV SOURCE_DATE_EPOCH=315532800

# Copy package.json and yarn.lock first for caching
COPY package.json yarn.lock ./

# Install dependencies deterministically
RUN yarn install --frozen-lockfile --non-interactive

# Copy the full project
COPY . .

# Build and export the static site (no need for `yarn export`)
RUN yarn build

# Ensure deterministic timestamps and permissions
RUN find out -exec touch -d @${SOURCE_DATE_EPOCH} {} + && \
    find out -exec chmod 644 {} +

# Define a volume for the build output
VOLUME /app/out

CMD ["sh", "-c", "tar -cf - out | sha256sum"]