/**
 * Convert megabytes to bytes
 * @param mib - size in MiB
 * @returns size in byte
 */
export const mibToByte = (mib: number) => mib * 1048576; // 1048576 = 1024 * 1024
