export const CompressionAvailableEncoding = [
  'none',
  'gzip',
  'brotli',
  'deflate',
] as const
export type CompressionEncodings = (typeof CompressionAvailableEncoding)[number]
export type CompressionPayload = string | number | object
