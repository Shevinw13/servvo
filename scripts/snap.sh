#!/bin/bash
# Quick simulator screenshot tool
# Usage: ./scripts/snap.sh <name>
# Example: ./scripts/snap.sh greenscape-home

OUTPUT_DIR="$HOME/Desktop/servvo-captures/mobile"
mkdir -p "$OUTPUT_DIR"

NAME="${1:-screenshot-$(date +%s)}"
xcrun simctl io booted screenshot "$OUTPUT_DIR/$NAME.png" 2>/dev/null
echo "📸 Saved: $OUTPUT_DIR/$NAME.png"
