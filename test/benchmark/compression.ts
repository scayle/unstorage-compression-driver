/* eslint-disable no-console, sonarjs/pseudo-random */
import { Bench } from 'tinybench'
import { compress, decompress } from '../../src/compression'
import type { Product, RFC33339Date, CentAmount } from '@scayle/storefront-api'
import { productFactory } from '@scayle/storefront-api/dist/test/factories'

/**
 * Resource usage metrics collected during benchmark execution.
 */
interface ResourceMetrics {
  /** Change in RSS memory (bytes) */
  memoryDelta: number
  /** Change in heap memory used (bytes) */
  heapUsedDelta: number
  /** CPU time spent in user mode (microseconds) */
  cpuUser: number
  /** CPU time spent in system mode (microseconds) */
  cpuSystem: number
}

// Realistic product data
const brands = [
  'Nike',
  'Adidas',
  'Puma',
  'Reebok',
  'Under Armour',
  'New Balance',
  'Asics',
  'Vans',
  'Converse',
  'Fila',
]
const categories = [
  'Running Shoes',
  'Sneakers',
  'Casual Wear',
  'Sport Jacket',
  'T-Shirt',
  'Hoodie',
  'Pants',
  'Shorts',
  'Backpack',
  'Hat',
]
const colors = [
  'Black',
  'White',
  'Red',
  'Blue',
  'Green',
  'Yellow',
  'Purple',
  'Orange',
  'Gray',
  'Brown',
  'Navy',
  'Beige',
]
const sizes = [
  'XS',
  'S',
  'M',
  'L',
  'XL',
  'XXL',
  '28',
  '30',
  '32',
  '34',
  '36',
  '38',
  '40',
]
const materials = [
  'Cotton',
  'Polyester',
  'Leather',
  'Suede',
  'Canvas',
  'Mesh',
  'Nylon',
  'Wool',
  'Denim',
  'Synthetic',
]
const adjectives = [
  'Premium',
  'Classic',
  'Modern',
  'Vintage',
  'Sport',
  'Casual',
  'Professional',
  'Comfort',
  'Elite',
  'Pro',
]

/**
 * Generates a random element from an array
 */
const randomElement = <T>(arr: T[]): T =>
  arr[Math.floor(Math.random() * arr.length)]

/**
 * Generates a realistic product name
 */
const generateProductName = (id: number): string => {
  const brand = randomElement(brands)
  const category = randomElement(categories)
  const adjective = randomElement(adjectives)
  return `${brand} ${adjective} ${category} ${id}`
}

/**
 * Generates a realistic product description with varying length
 */
const generateDescription = (productName: string, id: number): string => {
  const material = randomElement(materials)
  const features = [
    'breathable fabric',
    'moisture-wicking technology',
    'reinforced stitching',
    'ergonomic design',
    'durable construction',
    'lightweight materials',
    'premium quality',
    'comfortable fit',
  ]
  const randomFeatures = [...features].sort(() => Math.random() - 0.5).slice(
    0,
    Math.floor(Math.random() * 3) + 2,
  )

  return `Experience the ${productName}, crafted with ${material} for maximum comfort and durability. Features include ${
    randomFeatures.join(', ')
  }. Perfect for everyday wear or athletic activities. Item #${id}-${
    Math.random().toString(36).substring(2, 9).toUpperCase()
  }`
}

/**
 * Creates an array of product objects that approximates the target size in KB.
 * Each product is unique with realistic, highly individual data to avoid repetition and to simulate realistic payloads with diverse data, to avoid to high and unrealistic compression ratios.
 *
 * @param targetSizeKb - Target payload size in kilobytes
 * @returns Array of Product objects with diverse, realistic data
 */
const createPayloadOfSize = (targetSizeKb: number): Product[] => {
  const products: Product[] = []
  let currentSize = 0
  const targetSizeBytes = targetSizeKb * 1024

  let productId = 10000 + Math.floor(Math.random() * 90000) // Start with random ID

  while (currentSize < targetSizeBytes) {
    productId++
    const productName = generateProductName(productId)
    const brand = randomElement(brands)
    const color = randomElement(colors)
    const size = randomElement(sizes)
    const basePrice = Math.floor(Math.random() * 20000) + 1000 // 10-210 currency units
    const discount = Math.random() > 0.7
      ? Math.floor(Math.random() * 30) + 5
      : 0
    const finalPrice = discount > 0
      ? Math.floor(basePrice * (1 - discount / 100))
      : basePrice

    // Generate 1-5 unique image hashes
    const imageCount = Math.floor(Math.random() * 5) + 1
    const images = Array.from({ length: imageCount }, (_, i) => ({
      hash: `img_${productId}_${i}_${
        Math.random().toString(36).substring(2, 15)
      }`,
    }))

    // Generate 2-4 variants with different sizes/colors
    const variantCount = Math.floor(Math.random() * 3) + 2
    const variants = Array.from({ length: variantCount }, (_, i) => ({
      id: productId * 100 + i,
      lowestPriorPrice: {
        withTax: Math.random() > 0.5
          ? basePrice + Math.floor(Math.random() * 5000)
          : null,
        relativeDifferenceToPrice: null,
      },
      stock: {
        warehouseId: Math.floor(Math.random() * 10) + 1,
        quantity: Math.floor(Math.random() * 50),
      },
      createdAt: new Date(
        Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000,
      ).toISOString() as RFC33339Date,
      updatedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
        .toISOString() as RFC33339Date,
      price: {
        currencyCode: randomElement(['USD', 'EUR', 'GBP']),
        tax: {
          vat: {
            amount: Math.floor(basePrice * 0.19) as CentAmount,
            rate: 0.19,
          },
        },
        withoutTax: basePrice as CentAmount,
        withTax: finalPrice as CentAmount,
        appliedReductions: discount > 0
          ? [{
            type: 'relative' as const,
            value: discount,
            category: 'sale' as const,
            amount: {
              relative: discount,
              absoluteWithTax: (basePrice - finalPrice) as CentAmount,
            },
          }]
          : [],
      },
    }))

    const product = productFactory.build({
      id: productId,
      isActive: Math.random() > 0.1,
      isSoldOut: Math.random() < 0.1,
      isNew: Math.random() < 0.15,
      createdAt: new Date(
        Date.now() - Math.random() * 730 * 24 * 60 * 60 * 1000,
      ).toISOString(),
      updatedAt: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000)
        .toISOString(),
      images,
      attributes: {
        name: {
          key: 'name',
          label: productName,
          values: { label: productName },
        },
        brand: {
          key: 'brand',
          label: 'Brand',
          type: 'string',
          values: {
            label: brand,
            id: brands.indexOf(brand) + 1,
            value: brand.toLowerCase().replace(/\s+/g, '-'),
          },
        },
        color: {
          key: 'color',
          label: 'Color',
          type: 'string',
          values: {
            id: colors.indexOf(color) + 1,
            label: color,
            value: color.toLowerCase(),
          },
        },
        size: {
          key: 'size',
          label: 'Size',
          type: 'string',
          values: {
            id: sizes.indexOf(size) + 1,
            label: size,
            value: size.toLowerCase(),
          },
        },
        description: {
          key: 'description',
          label: 'Description',
          values: {
            label: generateDescription(productName, productId),
          },
        },
      },
      variants,
      priceRange: {
        min: {
          currencyCode: 'USD',
          tax: {
            vat: {
              amount: Math.floor(finalPrice * 0.19) as CentAmount,
              rate: 0.19,
            },
          },
          withoutTax: finalPrice as CentAmount,
          withTax: finalPrice as CentAmount,
          appliedReductions: [],
        },
        max: {
          currencyCode: 'USD',
          tax: {
            vat: {
              amount: Math.floor(basePrice * 0.19) as CentAmount,
              rate: 0.19,
            },
          },
          withoutTax: basePrice as CentAmount,
          withTax: basePrice as CentAmount,
          appliedReductions: [],
        },
      },
    })

    products.push(product)
    currentSize = JSON.stringify(products).length
  }

  return products
}

/**
 * Measures CPU and memory resource usage for an async operation.
 * Forces garbage collection before measurement if available.
 *
 * @template T - Return type of the measured function
 * @param fn - Async function to measure
 * @returns Object containing the function result and resource metrics
 */
const measureResources = async <T>(
  fn: () => Promise<T>,
): Promise<{ result: T; metrics: ResourceMetrics }> => {
  if (globalThis.gc) {
    globalThis.gc()
  }

  const memBefore = process.memoryUsage()
  const cpuBefore = process.cpuUsage()

  const result = await fn()

  const cpuAfter = process.cpuUsage(cpuBefore)
  const memAfter = process.memoryUsage()

  return {
    result,
    metrics: {
      memoryDelta: memAfter.rss - memBefore.rss,
      heapUsedDelta: memAfter.heapUsed - memBefore.heapUsed,
      cpuUser: cpuAfter.user,
      cpuSystem: cpuAfter.system,
    },
  }
}

/**
 * Formats byte values into human-readable strings with appropriate units.
 *
 * @param bytes - Number of bytes (can be negative for deltas)
 * @returns Formatted string with sign, value, and unit (e.g., "+1.23 KB")
 */
const formatBytes = (bytes: number): string => {
  if (bytes === 0) {
    return '0 B'
  }

  const k = 1024
  const sizes = ['B', 'KB', 'MB']
  const i = Math.floor(Math.log(Math.abs(bytes)) / Math.log(k))
  const value = bytes / k ** i
  const sign = bytes < 0 ? '-' : '+'

  return `${sign}${Math.abs(value).toFixed(2)} ${sizes[i]}`
}

/**
 * Formats time in microseconds to human-readable strings with appropriate units.
 *
 * @param microseconds - Time duration in microseconds
 * @returns Formatted string with value and unit (e.g., "250us", "1.23ms", "2.50s")
 */
const formatTime = (microseconds: number): string => {
  if (microseconds < 1000) {
    return `${microseconds.toFixed(0)}us`
  }

  if (microseconds < 1000000) {
    return `${(microseconds / 1000).toFixed(2)}ms`
  }

  return `${(microseconds / 1000000).toFixed(2)}s`
}

/**
 * Runs comprehensive compression benchmarks across multiple payload sizes and encodings.
 *
 * Benchmarks:
 * - Compression and decompression operations
 * - Multiple payload sizes (1KB to 256KB)
 * - Multiple encodings (none, deflate, gzip, brotli)
 *
 * Metrics collected:
 * - Latency (min, max, mean, percentiles)
 * - Throughput (operations per second)
 * - CPU time (user + system)
 * - Heap memory delta
 * - Compression ratio (for compress operations)
 */
async function runBenchmarks() {
  const payloadSizes = [
    { size: 1, label: '1KB' },
    { size: 16, label: '16KB' },
    { size: 64, label: '64KB' },
    { size: 128, label: '128KB' },
    { size: 256, label: '256KB' },
  ]

  const encodings: Array<'none' | 'deflate' | 'gzip' | 'brotli'> = [
    'none',
    'deflate',
    'gzip',
    'brotli',
  ]

  console.log('RUN  Compression Benchmarks\n')

  for (const { size, label } of payloadSizes) {
    const payload = createPayloadOfSize(size)
    const stringifiedPayload = JSON.stringify(payload)
    const actualSize = (stringifiedPayload.length / 1024).toFixed(2)

    // Create single bench instance for all operations on this payload
    const bench = new Bench({ time: 1000 })
    const metrics = new Map<string, ResourceMetrics[]>()
    const compressionRatios = new Map<string, number>()
    const compressedSizes = new Map<string, number>()

    // Add all tasks
    for (const encoding of encodings) {
      const compressKey = `${encoding} - compress`
      metrics.set(compressKey, [])

      bench.add(compressKey, async () => {
        const { result, metrics: m } = await measureResources(
          async () => await compress(stringifiedPayload, encoding),
        )
        metrics.get(compressKey)!.push(m)

        if (result && typeof result === 'string') {
          if (encoding !== 'none') {
            compressionRatios.set(
              compressKey,
              (1 - result.length / stringifiedPayload.length) * 100,
            )
          }
          compressedSizes.set(compressKey, result.length)
        }
      })

      const decompressKey = `${encoding} - decompress`
      metrics.set(decompressKey, [])

      // Pre-compress for decompression benchmark
      const compressed = await compress(stringifiedPayload, encoding)
      if (compressed && typeof compressed === 'string') {
        bench.add(decompressKey, async () => {
          const { metrics: m } = await measureResources(
            async () => await decompress(compressed, encoding),
          )
          metrics.get(decompressKey)!.push(m)
        })
      }
    }

    // Run all benchmarks
    await bench.run()

    printSummary(
      label,
      actualSize,
      bench,
      metrics,
      compressionRatios,
      compressedSizes,
      false,
    )
  }
}

/**
 * Prints benchmark results in a formatted table for a single payload size.
 *
 * @param label - Payload size label (e.g., "1KB", "16KB")
 * @param actualSize - Actual payload size in KB
 * @param bench - Tinybench instance with completed tasks
 * @param metrics - Map of task names to their resource metrics
 * @param compressionRatios - Map of task names to their compression ratios
 * @param compressedSizes - Map of task names to their compressed sizes
 * @param printAllMetrics - Whether to print all metrics or just key ones
 */
async function printSummary(
  label: string,
  actualSize: string,
  bench: Bench,
  metrics: Map<string, ResourceMetrics[]>,
  compressionRatios: Map<string, number>,
  compressedSizes: Map<string, number>,
  printAllMetrics: boolean = false,
) {
  console.log(`\n ✓ ${label} payload (${actualSize}KB)`)

  const tableData = bench.tasks.map((task) => {
    const result = task.result
    if (!result) {
      return null
    }

    const taskMetrics = metrics.get(task.name) || []
    const avgCpu = taskMetrics.reduce((s, m) =>
      s + m.cpuUser + m.cpuSystem, 0) /
      taskMetrics.length
    const avgHeap = taskMetrics.reduce((s, m) => s + m.heapUsedDelta, 0) /
      taskMetrics.length
    const ratio = compressionRatios.get(task.name)
    const compressedSize = compressedSizes.get(task.name)

    return {
      name: task.name,
      ...(printAllMetrics ? { 'hz': result.throughput.mean.toFixed(2) } : {}),
      'min': result.latency.min.toFixed(4),
      'max': result.latency.max.toFixed(4),
      'mean': result.latency.mean.toFixed(4),
      ...(printAllMetrics
        ? { 'p75': result.latency.p75?.toFixed(4) || '' }
        : {}),
      'p99': result.latency.p99?.toFixed(4) || '',
      ...(printAllMetrics
        ? { 'p995': result.latency.p995?.toFixed(4) || '' }
        : {}),
      ...(printAllMetrics
        ? { 'p999': result.latency.p999?.toFixed(4) || '' }
        : {}),
      ...(printAllMetrics
        ? { 'RME': `±${result.latency.rme.toFixed(2)}%` }
        : {}),
      'Samples': result.latency.samples.length,
      'AVG CPU': formatTime(avgCpu),
      'AVG Heap': formatBytes(avgHeap),
      ...(task.name.includes('compress')
        ? {
          'compr. size': compressedSize ? formatBytes(compressedSize) : '',
          'compr. ratio': ratio ? `${ratio.toFixed(1)}%` : '',
        }
        : {}),
    }
  }).filter(Boolean)

  console.table(tableData)
}

/**
 * Execute benchmarks when file is run directly.
 * Node should be started with `--expose-gc` flag to enable garbage collection control.
 */
runBenchmarks().catch(console.error)
