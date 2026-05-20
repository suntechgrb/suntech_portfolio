#!/usr/bin/env bash
# Replaces __BUILD_HASH__ in index.html so browsers fetch fresh CSS/JS after deploy.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
INDEX="${ROOT}/index.html"

if [[ ! -f "${INDEX}" ]]; then
    echo "index.html not found at ${INDEX}" >&2
    exit 1
fi

RAW_VERSION="${1:-$(git -C "${ROOT}" rev-parse --short HEAD 2>/dev/null || echo "dev")}"
VERSION="${RAW_VERSION:0:12}"
sed -i "s/__BUILD_HASH__/${VERSION}/g" "${INDEX}"
echo "Stamped asset version: ${VERSION}"
