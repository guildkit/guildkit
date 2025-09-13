#!/usr/bin/env -S pnpm exec jiti

import {
  CreateBucketCommand,
  BucketAlreadyExists,
  BucketAlreadyOwnedByYou,
  waitUntilBucketExists,
  type S3Client,
} from "@aws-sdk/client-s3";
import { storage, bucketName } from "../../../src/lib/storage.ts";

const createBucketIfNotExists = async (client: S3Client, bucketName: string) => {
  try {
    await client.send(new CreateBucketCommand({
      Bucket: bucketName,
    }));
    await waitUntilBucketExists({
      client,
      maxWaitTime: 20,
    }, { Bucket: bucketName });
  } catch (err) {
    if (err instanceof BucketAlreadyOwnedByYou) {
      // Skip creating the bucket because it already exists.
    } else if (err instanceof BucketAlreadyExists) {
      throw new Error(`The bucket "${ bucketName }" already exists in someone's AWS account. Bucket names must be globally unique.`);
    } else {
      throw err;
    }
  }
};

await createBucketIfNotExists(storage, bucketName);
