import { callSarvamWithRetry } from "./sarvam.service.js";
import { 
  getSystemPrompt, 
  validateProductIds, 
  buildProductActions, 
  buildContactActions,
  searchRelevantProducts,
  getProductById,
  getAllProducts,
  getContactInfo
} from "./knowledge.service.js";
import { env } from "../config/env.js";

function findMatchingProducts(query) {
  const lowerQuery = query.toLowerCase().trim();
  const exactMatches = [];
  const partialMatches = [];
  
  for (const product of getAllProducts()) {
    const productName = product.name.toLowerCase();
    const aliases = product.aliases.map(a => a.toLowerCase());
    
    // Check exact matches first (full product name or alias)
    const isExactMatch = productName === lowerQuery || aliases.includes(lowerQuery);
    
    // Check word-boundary matches (product name as whole words in query)
    const productWords = productName.split(/\s+/);
    const queryWords = lowerQuery.split(/\s+/);
    const isWordBoundaryMatch = productWords.every(word => 
      queryWords.some(qw => qw === word || qw.endsWith(word) || qw.startsWith(word))
    ) && productWords.length > 1;
    
    // Check alias word-boundary matches
    const isAliasWordMatch = aliases.some(alias => {
      const aliasWords = alias.split(/\s+/);
      return aliasWords.every(word => 
        queryWords.some(qw => qw === word || qw.endsWith(word) || qw.startsWith(word))
      ) && aliasWords.length > 1;
    });
    
    if (isExactMatch || isWordBoundaryMatch || isAliasWordMatch) {
      exactMatches.push(product);
    } else if (
      lowerQuery.includes(productName) ||
      aliases.some(alias => lowerQuery.includes(alias)) ||
      productName.includes(lowerQuery) ||
      aliases.some(alias => alias.includes(lowerQuery))
    ) {
      partialMatches.push(product);
    }
  }
  
  // Return exact matches first, then partial matches
  return [...exactMatches, ...partialMatches];
}

function buildLocalFallbackResponse(products, query) {
  if (products.length === 0) {
    return null;
  }
  
  const product = products[0];
  const productName = product.name;
  const description = product.description || "";
  const applications = product.applications?.join(", ") || "";
  
  let reply = `${productName} are part of the Pumpsquare product range.`;
  
  if (description) {
    reply += ` ${description}`;
  }
  
  if (applications) {
    reply += ` They are used for ${applications.toLowerCase()}.`;
  }
  
  reply += ` Explore the product page for available details.`;
  
  return {
    reply,
    productIds: [product.id],
    showContact: false,
    showQuote: false
  };
}

function buildContactFallbackResponse() {
  const contact = getContactInfo();
  return {
    reply: `You can contact Pumpsquare Systems LLP at our facility in Vithal Udyog Nagar, Gujarat. Our address is ${contact.address.full}. You can call us at ${contact.phones.map(p => p.label).join(" or ")}, or email us at ${contact.emails.primary}. You can also visit our Contact Us page for more details.`,
    productIds: [],
    showContact: true,
    showQuote: true
  };
}

function buildCompanyFallbackResponse() {
  return {
    reply: "Pumpsquare Systems LLP (Pumping and Solutions) is an industrial pump manufacturer based in Vithal Udyog Nagar, Gujarat, India. Operating from our 1,800 square meter facility established in 2011, we employ approximately 30 professionals and manufacture a comprehensive range of positive displacement pumps including Progressive Cavity Pumps, Triple Screw Pumps, Twin Screw Pumps, External Gear Pumps, Internal Gear Pumps, Gerotor Pumps, Trochoidal Gear Pumps, Shuttle Block Pumps, and External Lobe Pumps. We are ISO 9001:2008 certified and serve industries such as Chemical, Building, Pharmaceutical, Beverage & Food, Varnish & Paint, Sewage Technology, Agriculture, and Paper, with round-the-clock after-sales support available.",
    productIds: [],
    showContact: false,
    showQuote: false
  };
}

function buildUnrelatedFallbackResponse() {
  return {
    reply: "I'm the Pumpsquare AI Assistant. I can help you with Pumpsquare products, pumps, industrial applications and company information. How may I assist you?",
    productIds: [],
    showContact: false,
    showQuote: false
  };
}

function detectIntent(query) {
  const lowerQuery = query.toLowerCase();
  
  if (lowerQuery.includes("contact") || lowerQuery.includes("reach") || lowerQuery.includes("phone") || lowerQuery.includes("email") || lowerQuery.includes("address")) {
    return "contact";
  }
  
  if (lowerQuery.includes("quote") || lowerQuery.includes("quotation") || lowerQuery.includes("pricing") || lowerQuery.includes("price")) {
    return "quote";
  }
  
  if (lowerQuery.includes("pumpsquare") && (lowerQuery.includes("about") || lowerQuery.includes("what is") || lowerQuery.includes("company") || lowerQuery.includes("who"))) {
    return "company";
  }
  
  const products = findMatchingProducts(query);
  if (products.length > 0) {
    return "product";
  }
  
  return "unknown";
}

export async function processChat(messages) {
  const systemPrompt = getSystemPrompt();
  
  const conversationHistory = messages.slice(-env.CHAT_MAX_HISTORY);
  
  const lastUserMessage = conversationHistory
    .filter(m => m.role === "user")
    .pop();
  
  const userQuery = lastUserMessage?.content || "";
  const intent = detectIntent(userQuery);
  const matchedProducts = findMatchingProducts(userQuery);
  
  const sarvamMessages = [
    { role: "system", content: systemPrompt },
    ...conversationHistory
  ];
  
  try {
    const aiResponse = await callSarvamWithRetry(sarvamMessages);
    
    const { validIds, invalidIds } = validateProductIds(aiResponse.productIds);
    
    if (invalidIds.length > 0) {
      console.warn(`[Chatbot] Invalid product IDs from AI: ${invalidIds.join(", ")}`);
    }
    
    const productActions = buildProductActions(validIds);
    const contactActions = buildContactActions(aiResponse.showContact, aiResponse.showQuote);
    
    const actions = [...productActions, ...contactActions];
    
    return {
      success: true,
      reply: aiResponse.reply,
      actions
    };
  } catch (error) {
    console.error("[Chatbot] Sarvam API error:", error.message);
    
    let fallbackResponse = null;
    
    if (intent === "product" && matchedProducts.length > 0) {
      fallbackResponse = buildLocalFallbackResponse(matchedProducts, userQuery);
    } else if (intent === "contact") {
      fallbackResponse = buildContactFallbackResponse();
    } else if (intent === "quote") {
      fallbackResponse = buildContactFallbackResponse();
    } else if (intent === "company") {
      fallbackResponse = buildCompanyFallbackResponse();
    } else {
      fallbackResponse = buildUnrelatedFallbackResponse();
    }
    
    if (fallbackResponse) {
      const { validIds } = validateProductIds(fallbackResponse.productIds);
      const productActions = buildProductActions(validIds);
      const contactActions = buildContactActions(fallbackResponse.showContact, fallbackResponse.showQuote);
      
      return {
        success: true,
        reply: fallbackResponse.reply,
        actions: [...productActions, ...contactActions],
        fallback: true
      };
    }
    
    return {
      success: false,
      reply: "I'm temporarily unable to respond. Please try again in a moment or contact our team directly.",
      actions: []
    };
  }
}

export function createWelcomeMessage() {
  return {
    reply: "Hello! Welcome to Pumpsquare Systems LLP. I can help you explore our pumps, products, industrial applications and company information. What would you like to know?",
    actions: []
  };
}