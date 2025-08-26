import { promisify } from 'node:util'
import zlib from 'node:zlib'
import { Buffer } from 'node:buffer'
import type { CompressionEncodings, CompressionPayload } from './types'

export const compress = async (
  value: CompressionPayload,
  encoding: CompressionEncodings,
): Promise<CompressionPayload | undefined> => {
  if (!encoding || encoding === 'none') {
    return value
  }

  const encodingMethod = encoding === 'brotli' ? 'brotliCompress' : encoding
  const compression = promisify(zlib[encodingMethod])

  try {
    return (await compression(JSON.stringify(value))).toString('base64')
  } catch (error) {
    console.warn('[UnstorageCompressionDriver] Unable to compress data', error)
    return undefined // Explicitly return `undefined`, as per `ValueStorage` type definition, if value could not be decoded
  }
}

export const decompress = async (
  value: string,
  encoding: CompressionEncodings,
): Promise<CompressionPayload | undefined> => {
  if (!encoding || encoding === 'none') {
    return value
  }

  const decodingMethod = encoding === 'brotli' ? 'brotliDecompress' : 'unzip'
  const decompression = promisify(zlib[decodingMethod])

  try {
    const decompressedData = (
      await decompression(Buffer.from(value, 'base64'))
    ).toString()
    return JSON.parse(decompressedData)
  } catch (error) {
    console.warn(
      '[UnstorageCompressionDriver] Unable to decompress data',
      error,
    )
    return undefined // Explicitly return `undefined`, as per `ValueStorage` type definition, if value could not be decoded
  }
}
