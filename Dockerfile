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

# Build and export the static site
RUN yarn build

# Ensure deterministic timestamps and permissions for reproducibility
RUN find out -exec touch -d @${SOURCE_DATE_EPOCH} {} + && \
    find out -exec chmod 644 {} +

# Compute SHA-256 hash of the `out/` directory
RUN mkdir -p /squads-public-build/dist && \
    mv out/* /squads-public-build/dist && \
    tar -cf - squads-public-build/dist | sha256sum | awk '{ print $1 }' > /squads-public-build/hash.txt

# ✅ Fix: Ensure permissions are set correctly (use BusyBox-compatible chmod)
RUN chmod -R u+rwX,go+rX /squads-public-build/dist && \
    chmod u+rw,go+r /squads-public-build/hash.txt

# ✅ Fix: Separate the output copy step
RUN mkdir -p /output && cp -r /squads-public-build/* /output/

# No need for VOLUME; we copy files manually
CMD ["sh", "-c", "cat /output/hash.txt"]
