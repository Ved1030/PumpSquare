import { products, findProductById, searchProducts } from "../data/products.js";

export function matchProductsFromText(text) {
  const lowerText = text.toLowerCase();
  const matched = [];
  
  for (const product of products) {
    if (
      product.name.toLowerCase() === lowerText ||
      product.aliases.some(alias => alias.toLowerCase() === lowerText) ||
      lowerText.includes(product.name.toLowerCase()) ||
      product.aliases.some(alias => lowerText.includes(alias.toLowerCase()))
    ) {
      matched.push(product.id);
    }
  }
  
  return [...new Set(matched)];
}

export function getProductById(id) {
  return findProductById(id);
}

export function searchProductsByQuery(query) {
  return searchProducts(query);
}