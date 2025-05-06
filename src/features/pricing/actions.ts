'use server';

import { getProducts } from './controllers/get-products';
import { ProductWithPrices } from './types';

export async function fetchProducts(): Promise<ProductWithPrices[]> {
  try {
    const products = await getProducts();
    return products;
  } catch (error) {
    console.error('Error fetching products:', error);
    // Optionally, re-throw or return a specific error structure
    throw new Error('Failed to fetch products');
    // Or return an empty array:
    // return [];
  }
}
