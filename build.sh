#!/bin/bash

IMAGE_NAME="squads-public"
OUTPUT_DIR="squads-public-build"

echo "🔨 Building the reproducible Docker image: $IMAGE_NAME..."
docker build -t $IMAGE_NAME . || { echo "❌ Build failed!"; exit 1; }

echo "📂 Creating output directory: $OUTPUT_DIR..."
mkdir -p "$OUTPUT_DIR"

echo "🚀 Running the container and extracting the verified build..."
CONTAINER_ID=$(docker create $IMAGE_NAME) || { echo "❌ Container creation failed!"; exit 1; }

echo "📦 Copying built files from container..."
docker cp "$CONTAINER_ID:/output/." "$OUTPUT_DIR" || { echo "❌ Failed to copy files from container!"; exit 1; }

# Ensure cleanup
docker rm "$CONTAINER_ID" > /dev/null

echo "✅ Build completed! Files are in: $OUTPUT_DIR/"
echo "🔍 Retrieving the output hash..."

# Ensure the hash file exists
if [ -f "$OUTPUT_DIR/hash.txt" ]; then
    echo "🔗 Hash saved in: $OUTPUT_DIR/hash.txt"
    cat "$OUTPUT_DIR/hash.txt"
else
    echo "❌ Hash file not found!"
    exit 1
fi

echo "🎉 Done!"
