import { Product } from "./product.model"
import {faker} from '@faker-js/faker'
export const generateOneProduct = (): Product => {
    return {
        category: {
            id: faker.number.int(),
            name: faker.commerce.department()
        },
        price: parseInt(faker.commerce.price(), 10),
        id: faker.string.uuid(),
        title: faker.commerce.productName(),
        images : [faker.image.url(), faker.image.url()],
        description: faker.commerce.productDescription()
    }
}

export const generateManyProducts = (size =10): Product[] => {
    const products: Product[] = [];
    for (let index = 1; index < size; index++) {
       products.push(generateOneProduct())
        
    }

    return [...products]
}