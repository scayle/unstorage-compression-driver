import { promisify } from 'node:util'
import zlib from 'node:zlib'
import { Buffer } from 'node:buffer'
import { trace } from '@opentelemetry/api'

import type { CompressionEncodings, CompressionPayload } from './types'

export const compress = async (
  value: CompressionPayload,
  encoding: CompressionEncodings,
): Promise<CompressionPayload | undefined> => {
  if (!encoding || encoding === 'none') {
    return value
  }

  const tracer = trace.getTracer(
    'unstorage-compression-driver',
    '__package_version',
  )
  const encodingMethod = encoding === 'brotli' ? 'brotliCompress' : encoding
  const compression = promisify(zlib[encodingMethod])

  try {
    if (process.env.UNSTORAGE_COMPRESSION_TRACE?.toLowerCase() === 'true') {
      return await tracer.startActiveSpan(
        'compress',
        {},
        async (compressSpan) => {
          const stringified = await tracer.startActiveSpan(
            'stringify',
            {},
            (stringifySpan) => {
              const json = JSON.stringify(value)
              compressSpan.setAttribute('size', json.length)
              stringifySpan.end()
              return json
            },
          )

          const compressed = (await compression(stringified)).toString('base64')

          compressSpan.setAttribute('size', stringified.length)

          compressSpan.end()
          return compressed
        },
      )
    } else {
      return (await compression(JSON.stringify(value))).toString('base64')
    }
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
    if (process.env.UNSTORAGE_COMPRESSION_TRACE?.toLowerCase() === 'true') {
      const tracer = trace.getTracer(
        'unstorage-compression-driver',
        '__package_version',
      )
      return await tracer.startActiveSpan(
        'decompress',
        {},
        async (decompressSpan) => {
          const decompressedData = (
            await decompression(Buffer.from(value, 'base64'))
          ).toString()
          return await tracer.startActiveSpan('parse', {}, (parseSpan) => {
            const json = JSON.parse(decompressedData)
            parseSpan.setAttribute('size', decompressedData.length)
            decompressSpan.setAttribute('size', decompressedData.length)
            parseSpan.end()
            decompressSpan.end()
            return json
          })
        },
      )
    } else {
      return JSON.parse(
        (await decompression(Buffer.from(value, 'base64'))).toString(),
      )
    }
  } catch (error) {
    console.warn(
      '[UnstorageCompressionDriver] Unable to decompress data',
      error,
    )
    return undefined // Explicitly return `undefined`, as per `ValueStorage` type definition, if value could not be decoded
  }
}
