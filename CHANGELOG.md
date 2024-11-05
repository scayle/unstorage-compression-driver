# @scayle/unstorage-compression-driver

## 0.1.5

### Patch Changes

- Updated dependency `unstorage@1.12.0` to `unstorage@1.13.1`

## 0.1.4

### Patch Changes

- Updated dependency `unstorage@1.10.2` to `unstorage@1.12.0`

## 0.1.3

### Patch Changes

- Format code with dprint

## 0.1.2

### Patch Changes

- Removed unnecessary warning message that indicated that no cache value has been available

## 0.1.1

### Patch Changes

- Introduce `@scayle/unstorage-compression-driver` package as custom [unstorage](https://unstorage.unjs.io/) driver. It allows to compress values with `deflate`, `gzip` or `brotli` using `node:zlib` while passing the data source handling to a generic supported driver like `redis` or `Vercel KV`.
