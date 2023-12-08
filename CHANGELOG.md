# @scayle/unstorage-compression-driver

## 0.1.1

### Patch Changes

- Introduce `@scayle/unstorage-compression-driver` package as custom [unstorage](https://unstorage.unjs.io/) driver. It allows to compress values with `deflate`, `gzip` or `brotli` using `node:zlib` while passing the data source handling to a generic supported driver like `redis` or `Vercel KV`.
