import { describe, expect, it } from 'vitest'
import { createMockProductDataList } from '../test/utils/createMockData'
import { compress, decompress } from './compression'

describe('data compression', () => {
  const data = createMockProductDataList()
  const stringifiedData = JSON.stringify(data)

  // NOTE: Values are coupled to faker.seed(2023) in createMockData.ts
  // This data may need to be updated after Faker updates
  // The seed guarantees consistent results only with the same Faker version
  // https://v9.fakerjs.dev/guide/usage.html#reproducible-results
  const deflateEncodedData =
    'eJyFlEtuHDcQhq9SGCBZiYN+sF/ZWSNDSGIJRhzEi0wQFMnqaaLZZINkSxoY3uQ2AXKL3CQnCdjjh+KM5E0vWH8V6v+6qja/vttvftdqv/luv6moK4omE6xtm5bxuqiYKKqC1VlXVnWRN2VN+83FfjN7LWlN+eePv/Kq3vLqw7tTi4y3OJ2ibwZH4XHkioL0eo7a2VXw80AQjJ7gWwh6mg3BDabvNU7aHuBHOgqHXkHv3QRXdAeXx0gg3UQB7nUcACEYohGEU0dAq6BhsHPGefjp+hJevbyCS5QjM/owxFSxdx7ChD5Cv1iZ+kCj4/FxjzcYyWs0JweRyOw37y8eYcoV53WLOetrgYyXhWCo6pxRVRedkjk1VXMGU9duu+4sptdo47OYbukePNoDgeuThQkNhEH7GAA9gaKgD5YUjERzcnl0C2gLk7ZqC28Tp14nrVUQ4tEkSRwwwr02BiYcac0IMQlwRh+f5LFzVnqK9AWStso64qplWdVmjItSMIEVspbarhG5oBbr/yNpum15nsgbNKi+NjiCcIm6X8xnNi/mND23GBeP5u8/Ty4HTNaBHqReZ2DSD0lrTyrQ9uBJabIxfIAVB4Jr55SlEJIyz7JvPhaF7z/Ln6EUY2r0P4wK1VTUNBnL24wzXneKYSE5k1T2nERWqk+WHzEqmi0/z2g3aDmS/RqlWzxgwFHDK7SKPOiw+oseFU3oR1JgcVrpBbqjZDGQ17Q6/5QcZucjCD1SuDhRDRF9JHVaw1Qx71oOLy53bZb98CSZG4r45T7VvKyqssuZEJ1gXEhknewUa2qe18grxKo9d3bybXb+7Hw8G8+heekPzrpJS6AHkkvUdwRyQO1hmQdnQiRPKi2RcFaRAmFQjmAI40B+3aTXv+xgRpWCgTCubyKJ0o1BY5jCYzpVfSK3rt4yJ4pPsnnrnEr/8/1vm38BqmLhvg=='
  const gzipEncodedData =
    'H4sIAAAAAAAAE4WUS24cNxCGr1IYIFmJg36wX9lZI0NIYglGHMSLTBAUyeppotlkg2RLGhje5DYBcovcJCcJ2OOH4ozkTS9YfxXq/7qqNr++229+12q/+W6/qagriiYTrG2blvG6qJgoqoLVWVdWdZE3ZU37zcV+M3staU3554+/8qre8urDu1OLjLc4naJvBkfhceSKgvR6jtrZVfDzQBCMnuBbCHqaDcENpu81Ttoe4Ec6CodeQe/dBFd0B5fHSCDdRAHudRwAIRiiEYRTR0CroGGwc8Z5+On6El69vIJLlCMz+jDEVLF3HsKEPkK/WJn6QKPj8XGPNxjJazQnB5HI7DfvLx5hyhXndYs562uBjJeFYKjqnFFVF52SOTVVcwZT12677iym12jjs5hu6R482gOB65OFCQ2EQfsYAD2BoqAPlhSMRHNyeXQLaAuTtmoLbxOnXietVRDi0SRJHDDCvTYGJhxpzQgxCXBGH5/ksXNWeor0BZK2yjriqmVZ1WaMi1IwgRWyltquEbmgFuv/I2m6bXmeyBs0qL42OIJwibpfzGc2L+Y0PbcYF4/m7z9PLgdM1oEepF5nYNIPSWtPKtD24ElpsjF8gBUHgmvnlKUQkjLPsm8+FoXvP8ufoRRjavQ/jArVVNQ0GcvbjDNed4phITmTVPacRFaqT5YfMSqaLT/PaDdoOZL9GqVbPGDAUcMrtIo86LD6ix4VTehHUmBxWukFuqNkMZDXtDr/lBxm5yMIPVK4OFENEX0kdVrDVDHvWg4vLndtlv3wJJkbivjlPtW8rKqyy5kQnWBcSGSd7BRrap7XyCvEqj13dvJtdv7sfDwbz6F56Q/OuklLoAeSS9R3BHJA7WGZB2dCJE8qLZFwVpECYVCOYAjjQH7dpNe/7GBGlYKBMK5vIonSjUFjmMJjOlV9Ireu3jInik+yeeucSv/z/W+bfwFN7tyRlwUAAA=='
  const brotliEncodedData =
    'G5YFAJwFdjsyXBzf5ikNa1Yo9EZI0nnoltOa6vTBbKuoHOEKhwQiFdunTluTa4+1BFO/d31M9ox/qFca4/ynU0EDGOAaF1Oq2Hv/7roWtZZaY8GujQWuLZzbqITFBKAmW6i+aGfpkSE/mr/L/BPN/XxhPt6cyLF5Fh4gRgpNSmCYrEbX2fZ+fmb+6/m2xn/7akf0OfUbYIJ8xcJZM6IZu/8l5y/nDTLT08CWdaXCAdx6swUDyZrt4eeJSzWs4xtb/bQIG1Xo7jM9Ysf4jcUUYkX7T7dW2f7G+pGOM/zAObQsvYpez+/UVCn5F7ZF7Gd/Z6J67E8kFuXDbw1PmJrDJBe2OStH+Juqp9EzTqbzY5C297wSSAURJL1gGtKWHaAsCX2xAsktSILDqy9kjYx4RRiwtACbsEp8F0PVPEzDcDI5aW2UQqPF9nGmmBtNBqiBVof/KSsunm2W3n5jVkmyRpqH0/JEBD1Uxvob+TBevvJgS3//aaGBvx/C8EOQLQ/08XqlAXR5xClDWgbzzpVoTMWQQWltUzvzsJKaZ+0oq8fBpLqpI9xACYblcKAXwdvwj7b0eKBKHAR+ZFtrDYkOZVp3CDUY6Oj44B5qRuZ0Qs0BHUh0Uoqi8djNB1BnqZXUoYnuqLQIbI8APN/cyupahvhJh1zQfsXjRFiV80J33sFsATx/+fDU5FpFWhCH1xPGPai9jqHnzg1dj3IcSOh3xOavXqdm7I1FjZVDwqW5ETRVeoToYHRN3vHlGpsQGgjpwFUKfLq8qk/vCjx+5e0OJx/wUPMoy8LDPA=='

  describe('compress()', () => {
    it(`should use encoding 'none' and not compress the payload`, async () => {
      const compressedData = await compress(stringifiedData, 'none')

      expect(compressedData).toBe(stringifiedData)
    })

    it(`should use encoding 'deflate' and compress the payload`, async () => {
      const compressedData = await compress(stringifiedData, 'deflate')

      expect(compressedData).toBe(deflateEncodedData)
    })

    // TODO: Investigate different compression results locally vs CI
    it.skip(`should use encoding 'gzip' and compress the payload`, async () => {
      const compressedData = await compress(stringifiedData, 'gzip')

      expect(compressedData).toBe(gzipEncodedData)
    })

    it(`should use encoding 'brotli' and compress the payload`, async () => {
      const compressedData = await compress(stringifiedData, 'brotli')

      expect(compressedData).toBe(brotliEncodedData)
    })
  })

  describe('decompress()', () => {
    it(`should use encoding 'none' and not decompress the payload`, async () => {
      const decompressedData = await decompress(stringifiedData, 'none')

      expect(decompressedData).toBe(stringifiedData)
    })

    it(`should use encoding 'deflate' and decompress the payload`, async () => {
      const decompressedData = await decompress(deflateEncodedData, 'deflate')

      expect(decompressedData).toBe(stringifiedData)
    })

    it(`should use encoding 'gzip' and decompress the payload`, async () => {
      const decompressedData = await decompress(gzipEncodedData, 'gzip')

      expect(decompressedData).toBe(stringifiedData)
    })

    it(`should use encoding 'brotli' and decompress the payload`, async () => {
      const decompressedData = await decompress(brotliEncodedData, 'brotli')

      expect(decompressedData).toBe(stringifiedData)
    })
  })
})
