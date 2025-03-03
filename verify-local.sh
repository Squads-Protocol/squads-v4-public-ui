#!/bin/bash

EXPECTED_HASH=$(cat squads-public-build/hash.txt)
VERIFY_DIR="squads-public-build"

if [ ! -d "$VERIFY_DIR/dist" ]; then
    echo "❌ Failed to get local build dir!"
    exit 1
fi

# Compute hash for verification
COMPUTED_HASH=$(cd "$VERIFY_DIR/dist" && find . -type f -print0 | sort -z | xargs -0 cat | sha256sum | awk '{ print $1 }')

echo "✅ Expected Hash: $EXPECTED_HASH"
echo "🔍 Computed Hash: $COMPUTED_HASH"

if [ "$EXPECTED_HASH" == "$COMPUTED_HASH" ]; then
    echo "🎉 Build verification SUCCESSFUL! The local build is verified."
    exit 0
else
    echo "❌ Build verification FAILED! The local build does not match the hash."
    exit 1
fi
