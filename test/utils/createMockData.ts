// eslint-disable-next-line import/no-extraneous-dependencies
import { faker } from '@faker-js/faker'

faker.seed(2023)

export const createMockProductData = () => ({
  _id: faker.string.uuid(),
  price: faker.commerce.price({ min: 10, max: 200, dec: 2, symbol: '€' }),
  productName: faker.commerce.product(),
  productDescription: faker.commerce.productDescription(),
  productMaterial: faker.commerce.productMaterial(),
})

export const createMockProductDataList = (length = 5) =>
  Array(length)
    .fill('')
    .map(() => createMockProductData())
