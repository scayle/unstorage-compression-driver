// Compression driver for unstorage
import { Driver, defineDriver } from 'unstorage'
import { compress, decompress } from './compression'
import type { CompressionEncodings } from './types'

export interface CompressionDriverOptions {
  passthroughDriver: Driver
  encoding: CompressionEncodings
}

const DRIVER_NAME = 'compression'

/**
 * @param driver Unstorage driver to be wrapped and passed compressed data
 * @param options CompressionDriver specific options
 */
export const compressionDriver = defineDriver(
  (options: CompressionDriverOptions): Driver => {
    const driver = options?.passthroughDriver
    const encoding = options?.encoding

    return {
      name: DRIVER_NAME,
      options,
      async hasItem(key, _opts = {}) {
        return await driver.hasItem(key, _opts)
      },
      async getItem(key, _opts = {}) {
        const compressedValue = (await driver.getItem(key, _opts)) as string

        if (!compressedValue) {
          console.warn(
            'UnstorageCompressionDriver: Unable to get value from driver.setItem',
          )
          return
        }

        return (await decompress(compressedValue, encoding)) ?? null
      },
      async setItem(key, value, _opts = {}) {
        const compressedValue = (await compress(value, encoding)) ?? null

        if (!compressedValue || typeof compressedValue !== 'string') {
          console.warn(
            'UnstorageCompressionDriver: Unable to pass non-string value to driver.setItem',
          )
          return
        }

        return driver.setItem
          ? await driver.setItem(key, compressedValue, _opts)
          : undefined
      },
      async removeItem(key, _opts = {}) {
        return driver.removeItem
          ? await driver.removeItem(key, _opts)
          : undefined
      },
      async getKeys(base, _opts = {}) {
        return await driver.getKeys(base, _opts)
      },
      async clear(base, _opts = {}) {
        return driver.clear ? await driver.clear(base, _opts) : undefined
      },
      async dispose() {
        if (driver.dispose) {
          await driver.dispose()
        }
      },
      async watch(callback) {
        return driver.watch ? await driver.watch(callback) : () => {}
      },
    }
  },
)
