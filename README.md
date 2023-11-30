# @scayle/unstorage-compression-driver

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]

Compression driver for [unstorage](https://unstorage.unjs.io/).

## Installation

```bash
# Using pnpm
pnpm add @scayle/unstorage-compression-driver

# Using yarn
yarn add @scayle/unstorage-compression-driver

# Using npm
npm install @scayle/unstorage-compression-driver
```

## Usage

This is a special driver that handles (de)compression of values.

All write operations happen within a dedicated passthrough driver, that handles all storage functionality.

In the example below, we create an `redis` passthrough driver and select `brotli` as encoding / compression algorithm.

```ts
import { createStorage } from "unstorage";
import compressionDriver from "@scayle/unstorage-compression-driver";
import redisDriver from "unstorage/drivers/redis";

const storage = createStorage({
  driver: overlay({
    encoding: 'brotli'
    passthroughDriver: redisDriver({
      host: 'localhost',
      port: '6379'
    }),
  }),
});
```

> NOTE: As this is the first iteration of the compression driver,
> it currently does not support passing encoding options to the selected encoding method!

## Supported Compression Algorithms

The `@scayle/unstorage-compression-driver` currently supports `deflate`, `gzip` and `brotli` as compression algorithms.

> NOTE: If this driver will be used outside of a Node.js-based runtime,
> it needs to be checked if the desired runtime supports or polyfills `node:zlib`,
> as the compression implementation is depending on `node:zlib`!

### Deflate

Using [zlib.deflate](https://nodejs.org/docs/latest-v20.x/api/zlib.html#zlibdeflatebuffer-options-callback)
and [zlib.unzip](https://nodejs.org/docs/latest-v20.x/api/zlib.html#zlibunzipbuffer-options-callback).

- [node:zlib / Options](https://nodejs.org/docs/latest-v20.x/api/zlib.html#class-options)

### GZip

Using [zlib.gzip](https://nodejs.org/docs/latest-v20.x/api/zlib.html#zlibgzipbuffer-options-callback)
and [zlib.unzip](https://nodejs.org/docs/latest-v20.x/api/zlib.html#zlibunzipbuffer-options-callback).

- [node:zlib / Options](https://nodejs.org/docs/latest-v20.x/api/zlib.html#class-options)

### Brotli

Using [zlib.brotliCompress](https://nodejs.org/docs/latest-v20.x/api/zlib.html#zlibbrotlicompressbuffer-options-callback)
and [zlib.brotliDecompress](https://nodejs.org/docs/latest-v20.x/api/zlib.html#zlibbrotlidecompressbuffer-options-callback).

- [node:zlib / BrotliOptions](https://nodejs.org/docs/latest-v20.x/api/zlib.html#class-brotlioptions)

...

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/@scayle/unstorage-compression-driver/latest.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-version-href]: https://npmjs.com/package/@scayle/unstorage-compression-driver
[npm-downloads-src]: https://img.shields.io/npm/dm/@scayle/unstorage-compression-driver.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-downloads-href]: https://npmjs.com/package/@scayle/unstorage-compression-driver
[license-src]: https://img.shields.io/npm/l/@scayle/unstorage-compression-driver.svg?style=flat&colorA=18181B&colorB=28CF8D
[license-href]: https://npmjs.com/package/@scayle/unstorage-compression-driver
