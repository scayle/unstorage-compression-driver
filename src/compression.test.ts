import { describe, it, expect } from 'vitest'
import { createMockProductDataList } from '../test/utils/createMockData'
import { compress, decompress } from './compression'

describe('data compression', () => {
  const data = createMockProductDataList()
  const stringifiedData = JSON.stringify(data)

  // NOTE: Values are coupled to faker.seed(2023) in createMockData.ts
  const deflateEncodedData =
    'eJzV1M1q3DAQAOBXGXzoaRX8I9tSb0lKbg2FFHLoljKWxraILC2SNospvfR5+lR9kuLNhmbDbgu99WTsGZmZTyNln76usy9Gr7O366yW1Eosc1aqtmY8rzompEAmsC1F01BZ1PU6W62zTTCK9kt+fv9RlOIizw/fvd6qdIvTU/QDuhRfRt5RVMFskvFun3Dp9Axx9BQBA4GmaAZHGpKHB6KNcQMYB5NxGvQ2YGesSTNghB1ZuzxTIKfjCtJIMPmYIKbZmjhCQDcQ+P7w9zcQ0Wm0R9W8x0TBoN2Xcu+9JrfOvq1eiOSNyJUsK1bW1DBelx0TBW9ZW/GmokZJpeQJkaY4J3KFamn9vMgt7X7X3vswoYU4mpBeCT3zzH77THQB9yaN0Jsl1+knCjdAGjHBzlgLEz7QfkVMSwJuMKSzIHeJyL7y6HOShdTEOOcF4w0XTHDsWNH0bVN1ErGqTnhUZyfkxsTxTxwfR4LLjbfWJ1IjXFU8B7O0B9j3PmjsLMHOBLIUI0x+G5fXNEIga/ZB5Z0jlcyjSfMKihIm79IYocOUKMxgTU97rslrCu4gfFblJtBS8ZFK1/BCUVezrhEl41oiE7pXTBSCeFvVbVuKEypSnlO5Wzb8/5iSa5+Sf31s6l72TV7UTKi6YjwvJRNIFeOtzkWdY61FfurY8H8dk2sMnXcmEeyog8GjXTqnAIP1j4fLhcLgnZ+MQmvno6tmMI8EhHFeVP5+QXzOfgGhCcCC'
  const gzipEncodedData =
    'H4sIAAAAAAAAE9XUzWrcMBAA4FcZfOhpFfwj21JvSUpuDYUUcuiWMpbGtogsLZI2iym99Hn6VH2S4s2GZsNuC731ZOwZmZlPI2Wfvq6zL0avs7frrJbUSixzVqq2ZjyvOiakQCawLUXTUFnU9TpbrbNNMIr2S35+/1GU4iLPD9+93qp0i9NT9AO6FF9G3lFUwWyS8W6fcOn0DHH0FAEDgaZoBkcakocHoo1xAxgHk3Ea9DZgZ6xJM2CEHVm7PFMgp+MK0kgw+ZggptmaOEJANxD4/vD3NxDRabRH1bzHRMGg3Zdy770mt86+rV6I5I3IlSwrVtbUMF6XHRMFb1lb8aaiRkml5AmRpjgncoVqaf28yC3tftfe+zChhTiakF4JPfPMfvtMdAH3Jo3QmyXX6ScKN0AaMcHOWAsTPtB+RUxLAm4wpLMgd4nIvvLoc5KF1MQ45wXjDRdMcOxY0fRtU3USsapOeFRnJ+TGxPFPHB9HgsuNt9YnUiNcVTwHs7QH2Pc+aOwswc4EshQjTH4bl9c0QiBr9kHlnSOVzKNJ8wqKEibv0hihw5QozGBNT3uuyWsK7iB8VuUm0FLxkUrX8EJRV7OuESXjWiITuldMFIJ4W9VtW4oTKlKeU7lbNvz/mJJrn5J/fWzqXvZNXtRMqLpiPC8lE0gV463ORZ1jrUV+6tjwfx2TawyddyYR7KiDwaNdOqcAg/WPh8uFwuCdn4xCa+ejq2YwjwSEcV5U/n5BfM5+AQgvdps2BQAA'
  const brotliEncodedData =
    'GzUFYByHsXukjPIlrqw1JfLX9v+l+sbuDvwPqW/hKpYg6+A2U70nzNuh39sEMQ+t3O//vv3aNXuEEWwiCd07M3/BTrZ6ga0bJvijBeidTCN8aimoN+KtxlT40QIrPJnxhUuDJ7FGruZoy0nfRvptFJpEy4KI4dj9fxHwJDbZLP9lwR8RgV4AXh+Jcy+76Np99xZ5wozqTRuVfnsI5UZTOwAcHHt9o248ZNyfNX4h498zabt5FrfRwdmEcJ/drOge7exyzEUUJzgBe+kXcO3EI2liAnRK1PlIDZdgbLlTLXSkU+eoVUvBPeu2WxbThz9evBiYPWmjuOkekU1EK11FvV0P6u2w8A45v8DHCUUlPhkwoeI5s7+r054I3UEe6vwBjcp1hzQzrlwYglk7JMfL0K/a5rVqSQEXfyd3s180hzusZaWCIa+r0S9KkR3MM10E0ylksr5FEaDRQQ9YDMzUyAauYAUx9BGf9ljoVLBc8zthfMYR9xeQyt3qYPe5JBgjpHqmoGqpKvu+8T/4mXxklF1XFr1ffPWC2DeOa+VIKlj7/La8BKcWL6jqSth3w26csog7/zD6joUwSmAzC2FPnsqC34RlUeYxjN7PWAPVF2QYrGciRB+dAA=='

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
