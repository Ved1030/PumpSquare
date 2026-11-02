import { buildSystemPrompt, getKnowledgeContext } from "../data/pumpsquareKnowledge.js";
import { products, productRegistry, findProductById, searchProducts } from "../data/products.js";
import { industries, industryRegistry, findIndustryById, searchIndustries } from "../data/industries.js";
import { companyInfo } from "../data/company.js";
import { contactInfo } from "../data/contact.js";

export function getSystemPrompt() {
  return buildSystemPrompt();
}

export function getKnowledge() {
  return getKnowledgeContext();
}

export function validateProductIds(productIds) {
  const validIds = [];
  const invalidIds = [];
  
  for (const id of productIds) {
    const product = findProductById(id);
    if (product) {
      validIds.push(id);
    } else {
      invalidIds.push(id);
    }
  }
  
  return { validIds, invalidIds };
}

export function getProductById(id) {
  return findProductById(id);
}

export function buildProductActions(productIds) {
  return productIds.map(id => {
    const product = findProductById(id);
    if (!product) return null;
    return {
      type: "product",
      label: `View ${product.name}`,
      href: product.href
    };
  }).filter(Boolean);
}

export function buildContactActions(showContact, showQuote) {
  const actions = [];
  
  if (showContact) {
    actions.push({
      type: "contact",
      label: "Contact Us",
      href: contactInfo.contactPage
    });
  }
  
  if (showQuote) {
    actions.push({
      type: "quote",
      label: "Request a Quote",
      href: contactInfo.quotePage
    });
  }
  
  return actions;
}

export function searchRelevantProducts(query) {
  return searchProducts(query);
}

export function searchRelevantIndustries(query) {
  return searchIndustries(query);
}

export function getAllProducts() {
  return products;
}

export function getAllIndustries() {
  return industries;
}

export function getCompanyInfo() {
  return companyInfo;
}

export function getContactInfo() {
  return contactInfo;
}

export function getProductRegistry() {
  return productRegistry;
}

export function getIndustryRegistry() {
  return industryRegistry;
}