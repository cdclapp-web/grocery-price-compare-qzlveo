
import { Platform } from 'react-native';

export interface ScrapedPrice {
  store: string;
  price: number | null;
  error?: string;
  lastUpdated: Date;
}

interface StoreConfig {
  name: string;
  url: string;
  priceSelector: string;
}

const MODELO_STORES: StoreConfig[] = [
  {
    name: "Fry's Food Store",
    url: "https://www.frysfood.com/p/modelo-especial-mexican-lager-import-beer/0008066095776?fulfillment=PICKUP&searchType=default_search",
    priceSelector: "price",
  },
  {
    name: "Walmart",
    url: "https://www.walmart.com/ip/Modelo-Especial-Mexican-Lager-Import-Beer-24-Pack-12-fl-oz-Bottles-4-4-ABV/23658514",
    priceSelector: "price",
  },
  {
    name: "Safeway",
    url: "https://www.safeway.com/shop/product-details.960104493.html",
    priceSelector: "price",
  },
];

/**
 * Attempts to extract price from HTML content
 * This is a basic implementation and may need adjustments based on actual HTML structure
 */
function extractPriceFromHTML(html: string, storeName: string): number | null {
  console.log(`Attempting to extract price for ${storeName}`);
  
  try {
    // Common price patterns in HTML
    const pricePatterns = [
      // Match $XX.XX format
      /\$(\d+\.\d{2})/g,
      // Match price in data attributes
      /data-price[^>]*?(\d+\.\d{2})/gi,
      // Match price in JSON-LD
      /"price":\s*"?(\d+\.\d{2})"?/gi,
      // Match price in meta tags
      /content="(\d+\.\d{2})"/gi,
    ];

    const foundPrices: number[] = [];

    for (const pattern of pricePatterns) {
      let match;
      while ((match = pattern.exec(html)) !== null) {
        const price = parseFloat(match[1]);
        // Filter out unrealistic prices (too low or too high for a 24-pack)
        if (price >= 15 && price <= 50) {
          foundPrices.push(price);
        }
      }
    }

    if (foundPrices.length > 0) {
      // Return the most common price or the first one found
      const priceCount = new Map<number, number>();
      foundPrices.forEach(price => {
        priceCount.set(price, (priceCount.get(price) || 0) + 1);
      });
      
      let mostCommonPrice = foundPrices[0];
      let maxCount = 0;
      
      priceCount.forEach((count, price) => {
        if (count > maxCount) {
          maxCount = count;
          mostCommonPrice = price;
        }
      });

      console.log(`Found price for ${storeName}: $${mostCommonPrice}`);
      return mostCommonPrice;
    }

    console.log(`No valid price found for ${storeName}`);
    return null;
  } catch (error) {
    console.error(`Error extracting price for ${storeName}:`, error);
    return null;
  }
}

/**
 * Fetches price from a single store
 */
async function fetchStorePrice(store: StoreConfig): Promise<ScrapedPrice> {
  console.log(`Fetching price from ${store.name}...`);
  
  try {
    // Add headers to mimic a browser request
    const response = await fetch(store.url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Cache-Control': 'no-cache',
      },
    });

    if (!response.ok) {
      console.log(`Failed to fetch ${store.name}: ${response.status} ${response.statusText}`);
      return {
        store: store.name,
        price: null,
        error: `HTTP ${response.status}: ${response.statusText}`,
        lastUpdated: new Date(),
      };
    }

    const html = await response.text();
    console.log(`Received HTML from ${store.name}, length: ${html.length}`);
    
    const price = extractPriceFromHTML(html, store.name);

    if (price === null) {
      return {
        store: store.name,
        price: null,
        error: 'Could not extract price from page',
        lastUpdated: new Date(),
      };
    }

    return {
      store: store.name,
      price,
      lastUpdated: new Date(),
    };
  } catch (error) {
    console.error(`Error fetching price from ${store.name}:`, error);
    return {
      store: store.name,
      price: null,
      error: error instanceof Error ? error.message : 'Unknown error',
      lastUpdated: new Date(),
    };
  }
}

/**
 * Fetches prices for Modelo 24-pack from all stores
 */
export async function fetchModeloPrices(): Promise<ScrapedPrice[]> {
  console.log('Starting to fetch Modelo prices from all stores...');
  
  try {
    // Fetch all prices in parallel
    const pricePromises = MODELO_STORES.map(store => fetchStorePrice(store));
    const results = await Promise.all(pricePromises);
    
    console.log('Finished fetching all prices:', results);
    return results;
  } catch (error) {
    console.error('Error fetching Modelo prices:', error);
    // Return error results for all stores
    return MODELO_STORES.map(store => ({
      store: store.name,
      price: null,
      error: 'Failed to fetch prices',
      lastUpdated: new Date(),
    }));
  }
}

/**
 * Gets fallback prices (used when scraping fails)
 */
export function getFallbackModeloPrices(): ScrapedPrice[] {
  return [
    {
      store: "Fry's Food Store",
      price: 24.99,
      lastUpdated: new Date(),
    },
    {
      store: "Walmart",
      price: 22.98,
      lastUpdated: new Date(),
    },
    {
      store: "Safeway",
      price: 26.49,
      lastUpdated: new Date(),
    },
  ];
}
