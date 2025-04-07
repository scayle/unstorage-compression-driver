# @scayle/unstorage-compression-driver

## 0.2.6

### Patch Changes

- Updated dependency `destr@2.0.3` to `destr@2.0.5`

## 0.2.5

### Patch Changes

- Updated dependency `destr@2.0.3` to `destr@2.0.5`

## 0.2.4

### Patch Changes

- Updated dependency `unstorage@1.14.4` to `unstorage@1.15.0`

## 0.2.3

### Patch Changes

- Updated dependency `unstorage@1.14.0` to `unstorage@1.14.4`

## 0.2.2

### Patch Changes

- Updated dependency `unstorage@1.13.1` to `unstorage@1.14.0`

## 0.2.1

### Patch Changes

- Fix publishing error which caused some files to be missing

## 0.2.0

### Minor Changes

- Resolved warnings with the types and exports configuration reported by `AreTheTypesWrong`[https://github.com/arethetypeswrong/arethetypeswrong.github.io]. This was done as a preventative measure to protect against potential ESM or TypeScript issues.

  Additionally, we now build the library with `unbuild` rather than `tsc`.

  This is essentially an internal refactor and should have no user-visible changes. However, as part of this change, the `compression` and `types` export configurations were removed from `package.json`. The exports were unused, but are mentioned here as it could possibly result in a breaking change.

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
