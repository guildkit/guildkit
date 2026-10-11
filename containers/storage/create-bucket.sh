#!/bin/sh

# Create the `guildkit` bucket on building the image.
# Start RustFS temporarily, create the bucket, then stop RustFS.

set -eu

# Same as RUSTFS_ACCESS_KEY and RUSTFS_SECRET_KEY configured in compose.yaml
access_key=guildkit
secret_key=guildkit
# The default value of `bucketName` in projects/guildkit/src/lib/storage.ts
bucket=guildkit

RUSTFS_ACCESS_KEY="$access_key" RUSTFS_SECRET_KEY="$secret_key" /entrypoint.sh rustfs &
pid=$!

# Retry until RustFS accepts the request.
# RustFS returns 503 for a while even after `/health` gets ready.
tries=0
until \
  curl --silent --fail \
    --request PUT \
    --aws-sigv4 "aws:amz:us-east-1:s3" \
    --user "$access_key:$secret_key" \
    "http://localhost:9000/$bucket"
do
  tries=$((tries + 1))
  if [ "$tries" -ge 60 ]; then
    echo "[ERROR] Failed to create the bucket \"$bucket\"." >&2
    kill "$pid"
    exit 1
  fi
  sleep 1
done

kill "$pid"
wait "$pid" || true
