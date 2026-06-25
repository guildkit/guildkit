#!/usr/bin/env -S pnpm exec jiti

//MISE wait_for=[ "setup:docker" ]

import {
  BucketAlreadyExists,
  BucketAlreadyOwnedByYou,
  CreateBucketCommand,
  HeadBucketCommand,
  S3Client,
  waitUntilBucketExists,
} from "@aws-sdk/client-s3";

const createBucketIfNotExists = async () => {
  const bucketName = "guildkit";
  const storage = new S3Client({
    endpoint: "http://localhost:9000",
    forcePathStyle: true, // Required for rustfs
    region: "us-east-1", // rustfs's default
    credentials: {
      accessKeyId: "guildkit", // Same as RUSTFS_ACCESS_KEY configured in compose.yaml
      secretAccessKey: "guildkit", // Same as RUSTFS_SECRET_KEY configured in compose.yaml
    },
  });
  try {
    await storage.send(new CreateBucketCommand({
      Bucket: bucketName,
    }));
    await waitUntilBucketExists({
      client: storage,
      maxWaitTime: 20,
    }, { Bucket: bucketName });
  } catch (err) {
    if (err instanceof BucketAlreadyOwnedByYou) {
      // Skip creating the bucket because it already exists.
    } else if (err instanceof BucketAlreadyExists) {
      try {
        // Check if we own the bucket by attempting to access it.
        // If we can access it, we own it, so skip. If we cannot access it, throw an error.
        await storage.send(new HeadBucketCommand({ Bucket: bucketName }));
      } catch {
        throw new Error(`The bucket "${ bucketName }" already exists in someone's AWS account. Bucket names must be globally unique.`);
      }
    } else {
      throw err;
    }
  }
};

await createBucketIfNotExists();
