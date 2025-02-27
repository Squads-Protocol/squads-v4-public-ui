#!/bin/bash

# Define project-specific naming
IMAGE_NAME="squads-public"
OUTPUT_DIR="squads-public-build"

echo "🔨 Building the reproducible Docker image: $IMAGE_NAME..."
docker build -t $IMAGE_NAME . || { echo "❌ Build failed!"; exit 1; }

echo "📂 Creating output directory: $OUTPUT_DIR..."
mkdir -p "$OUTPUT_DIR"

echo "🚀 Running the container and extracting the verified build..."
docker run --rm -v "$(pwd)/$OUTPUT_DIR:/app/out" $IMAGE_NAME || { echo "❌ Container run failed!"; exit 1; }

echo "✅ Build completed! Files are in: $OUTPUT_DIR/"
echo "🔍 Verifying the output hash..."

# Run the container again to get the hash and save it
docker run --rm $IMAGE_NAME > "$OUTPUT_DIR/hash.txt"

echo "🔗 Hash saved to: $OUTPUT_DIR/hash.txt"
echo "📜 Hash:"
cat "$OUTPUT_DIR/hash.txt"

echo "🎉 Done! You can now upload $OUTPUT_DIR/out/ to IPFS or Arweave!"
