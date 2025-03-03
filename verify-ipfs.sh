#!/bin/bash

EXPECTED_HASH=$(cat squads-public-build/hash.txt)

if [ -z "$1" ]; then
    echo "❌ Error: No IPFS CID provided."
    echo "Usage: $0 <IPFS_CID>"
    exit 1
fi

IPFS_CID="$1"

# temp directory for verification
VERIFY_DIR="squads-public-verify"
rm -rf "$VERIFY_DIR"
mkdir -p "$VERIFY_DIR"

echo "🌍 Downloading the IPFS build: $IPFS_CID..."
ipfs get "$IPFS_CID" -o "$VERIFY_DIR/dist"

if [ ! -d "$VERIFY_DIR/dist" ]; then
    echo "❌ Failed to download IPFS build!"
    exit 1
fi

# Compute hash for verification
COMPUTED_HASH=$(cd "$VERIFY_DIR/dist" && find . -type f -print0 | sort -z | xargs -0 cat | sha256sum | awk '{ print $1 }')

echo "✅ Expected Hash: $EXPECTED_HASH"
echo "🔍 Computed Hash: $COMPUTED_HASH"

if [ "$EXPECTED_HASH" == "$COMPUTED_HASH" ]; then
    echo "🎉 Build verification SUCCESSFUL! The downloaded IPFS build is authentic."
    exit 0
else
    echo "❌ Build verification FAILED! The downloaded IPFS build does not match the expected hash."
    exit 1
fi
