
import React, { useMemo, useState, useEffect } from "react";
import { ScrollView, StyleSheet, View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { colors } from "@/styles/commonStyles";
import { IconSymbol } from "@/components/IconSymbol";
import { useLocalSearchParams, useRouter } from "expo-router";
import { fetchModeloPrices, getFallbackModeloPrices, ScrapedPrice } from "@/services/priceScraperService";

interface StorePrice {
  store: string;
  price: number;
  location: string;
  icon: string;
  color: string;
  error?: string;
}

interface ProductData {
  id: string;
  name: string;
  description: string;
  icon: string;
  iosIcon: string;
  prices: {
    frys: number;
    walmart: number;
    safeway: number;
  };
}

const productsData: Record<string, ProductData> = {
  "modelo-24": {
    id: "modelo-24",
    name: "Modelo Especial 24-Pack",
    description: "24 pack of 12 oz bottles",
    icon: "liquor",
    iosIcon: "sparkles",
    prices: {
      frys: 29.99,
      walmart: 27.94,
      safeway: 28.88,
    },
  },
  "high-noon-8": {
    id: "high-noon-8",
    name: "High Noon Seltzer 8-Pack",
    description: "8 pack of hard seltzer",
    icon: "liquor",
    iosIcon: "sparkles",
    prices: {
      frys: 15.99,
      walmart: 17.87,
      safeway: 15.99,
    },
  },
  "chicken-breast": {
    id: "chicken-breast",
    name: "Foster Farms Chicken Breast",
    description: "Price per pound",
    icon: "restaurant",
    iosIcon: "fork.knife",
    prices: {
      frys: 4.99,
      walmart: 5.17,
      safeway: 8.99,
    },
  },
  "ground-beef": {
    id: "ground-beef",
    name: "85% Lean Ground Beef",
    description: "Price per pound",
    icon: "restaurant",
    iosIcon: "fork.knife",
    prices: {
      frys: 7.49,
      walmart: 7.32,
      safeway: 10.99,
    },
  },
  "eggs-dozen": {
    id: "eggs-dozen",
    name: "Dozen Eggs",
    description: "12 large eggs",
    icon: "egg",
    iosIcon: "circle.grid.3x3.fill",
    prices: {
      frys: 2.98,
      walmart: 1.97,
      safeway: 4.99,
    },
  },
};

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [isLoadingPrices, setIsLoadingPrices] = useState(false);
  const [scrapedPrices, setScrapedPrices] = useState<ScrapedPrice[] | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const productData = useMemo(() => {
    return productsData[id as string];
  }, [id]);

  // Fetch prices for Modelo when component mounts
  useEffect(() => {
    if (id === "modelo-24") {
      loadModeloPrices();
    }
  }, [id]);

  const loadModeloPrices = async () => {
    console.log("Loading Modelo prices...");
    setIsLoadingPrices(true);
    
    try {
      const prices = await fetchModeloPrices();
      console.log("Scraped prices:", prices);
      setScrapedPrices(prices);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Error loading Modelo prices:", error);
      // Use fallback prices on error
      const fallbackPrices = getFallbackModeloPrices();
      setScrapedPrices(fallbackPrices);
      setLastUpdated(new Date());
    } finally {
      setIsLoadingPrices(false);
    }
  };

  const storePrices: StorePrice[] = useMemo(() => {
    if (!productData) return [];
    
    // For Modelo, use scraped prices if available
    if (id === "modelo-24" && scrapedPrices) {
      return [
        {
          store: "Fry's Food Store",
          price: scrapedPrices.find(p => p.store === "Fry's Food Store")?.price || productData.prices.frys,
          location: "Phoenix, AZ",
          icon: "storefront",
          color: "#0066CC",
          error: scrapedPrices.find(p => p.store === "Fry's Food Store")?.error,
        },
        {
          store: "Walmart",
          price: scrapedPrices.find(p => p.store === "Walmart")?.price || productData.prices.walmart,
          location: "Phoenix, AZ",
          icon: "shopping_cart",
          color: "#0071CE",
          error: scrapedPrices.find(p => p.store === "Walmart")?.error,
        },
        {
          store: "Safeway",
          price: scrapedPrices.find(p => p.store === "Safeway")?.price || productData.prices.safeway,
          location: "Phoenix, AZ",
          icon: "local_grocery_store",
          color: "#E31837",
          error: scrapedPrices.find(p => p.store === "Safeway")?.error,
        },
      ];
    }
    
    // For other products, use hardcoded prices
    return [
      {
        store: "Fry's Food Store",
        price: productData.prices.frys,
        location: "Phoenix, AZ",
        icon: "storefront",
        color: "#0066CC",
      },
      {
        store: "Walmart",
        price: productData.prices.walmart,
        location: "Phoenix, AZ",
        icon: "shopping_cart",
        color: "#0071CE",
      },
      {
        store: "Safeway",
        price: productData.prices.safeway,
        location: "Phoenix, AZ",
        icon: "local_grocery_store",
        color: "#E31837",
      },
    ];
  }, [productData, id, scrapedPrices]);

  const lowestPrice = useMemo(() => {
    const validPrices = storePrices.filter(sp => sp.price > 0).map(sp => sp.price);
    return validPrices.length > 0 ? Math.min(...validPrices) : 0;
  }, [storePrices]);

  const highestPrice = useMemo(() => {
    const validPrices = storePrices.filter(sp => sp.price > 0).map(sp => sp.price);
    return validPrices.length > 0 ? Math.max(...validPrices) : 0;
  }, [storePrices]);

  if (!productData) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Product not found</Text>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity 
          style={styles.backButtonTop}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <IconSymbol 
            ios_icon_name="chevron.left" 
            android_material_icon_name="arrow_back" 
            size={24} 
            color={colors.card} 
          />
          <Text style={styles.backButtonTopText}>Back</Text>
        </TouchableOpacity>

        <View style={styles.productCard}>
          <View style={styles.productHeader}>
            <View style={styles.productIconContainer}>
              <IconSymbol 
                ios_icon_name={productData.iosIcon} 
                android_material_icon_name={productData.icon} 
                size={40} 
                color={colors.primary} 
              />
            </View>
            <View style={styles.productInfo}>
              <Text style={styles.productName}>{productData.name}</Text>
              <Text style={styles.productDetails}>{productData.description}</Text>
            </View>
          </View>
        </View>

        {id === "modelo-24" && (
          <View style={styles.statusCard}>
            <View style={styles.statusHeader}>
              <IconSymbol 
                ios_icon_name="arrow.clockwise.circle.fill" 
                android_material_icon_name="sync" 
                size={20} 
                color={colors.primary} 
              />
              <Text style={styles.statusTitle}>Live Price Fetching</Text>
            </View>
            
            {isLoadingPrices ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color={colors.primary} />
                <Text style={styles.loadingText}>Fetching current prices from stores...</Text>
              </View>
            ) : (
              <View>
                <Text style={styles.statusText}>
                  {scrapedPrices && scrapedPrices.some(p => p.price !== null)
                    ? "✓ Prices updated from store websites"
                    : "⚠ Using fallback prices (websites may be blocking requests)"}
                </Text>
                {lastUpdated && (
                  <Text style={styles.statusTimestamp}>
                    Last updated: {lastUpdated.toLocaleTimeString()}
                  </Text>
                )}
                <TouchableOpacity 
                  style={styles.refreshButton}
                  onPress={loadModeloPrices}
                  activeOpacity={0.7}
                >
                  <IconSymbol 
                    ios_icon_name="arrow.clockwise" 
                    android_material_icon_name="refresh" 
                    size={16} 
                    color={colors.primary} 
                  />
                  <Text style={styles.refreshButtonText}>Refresh Prices</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}

        <View style={styles.pricesSection}>
          <Text style={styles.sectionTitle}>Store Prices</Text>
          
          {storePrices.map((storePrice, index) => {
            const isLowest = storePrice.price === lowestPrice && storePrice.price > 0;
            const hasError = storePrice.error !== undefined;
            
            return (
              <React.Fragment key={index}>
                <View 
                  style={[
                    styles.storeCard,
                    isLowest && styles.storeCardLowest,
                    hasError && styles.storeCardError,
                  ]}
                >
                  <View style={styles.storeCardContent}>
                    <View style={[styles.storeIconContainer, { backgroundColor: storePrice.color }]}>
                      <IconSymbol 
                        ios_icon_name="storefront" 
                        android_material_icon_name={storePrice.icon} 
                        size={28} 
                        color="#FFFFFF" 
                      />
                    </View>
                    
                    <View style={styles.storeInfo}>
                      <Text style={styles.storeName}>{storePrice.store}</Text>
                      <Text style={styles.storeLocation}>{storePrice.location}</Text>
                      {hasError && (
                        <Text style={styles.errorMessage}>⚠ {storePrice.error}</Text>
                      )}
                    </View>
                    
                    <View style={styles.priceContainer}>
                      {storePrice.price > 0 ? (
                        <>
                          <Text style={[styles.price, isLowest && styles.priceLowest]}>
                            ${storePrice.price.toFixed(2)}
                          </Text>
                          {isLowest && (
                            <View style={styles.bestPriceBadge}>
                              <IconSymbol 
                                ios_icon_name="star.fill" 
                                android_material_icon_name="star" 
                                size={14} 
                                color={colors.highlight} 
                              />
                              <Text style={styles.bestPriceText}>Best Price</Text>
                            </View>
                          )}
                        </>
                      ) : (
                        <Text style={styles.priceUnavailable}>N/A</Text>
                      )}
                    </View>
                  </View>
                </View>
              </React.Fragment>
            );
          })}
        </View>

        {lowestPrice > 0 && highestPrice > 0 && (
          <View style={styles.savingsCard}>
            <IconSymbol 
              ios_icon_name="dollarsign.circle.fill" 
              android_material_icon_name="savings" 
              size={32} 
              color={colors.primary} 
            />
            <View style={styles.savingsInfo}>
              <Text style={styles.savingsTitle}>Potential Savings</Text>
              <Text style={styles.savingsAmount}>
                Save up to ${(highestPrice - lowestPrice).toFixed(2)}
              </Text>
              <Text style={styles.savingsDescription}>
                by shopping at the lowest priced store
              </Text>
            </View>
          </View>
        )}

        <View style={styles.infoCard}>
          <IconSymbol 
            ios_icon_name="info.circle.fill" 
            android_material_icon_name="info" 
            size={24} 
            color={colors.primary} 
          />
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoText}>
              {id === "modelo-24" 
                ? "This app attempts to fetch live prices from store websites. However, many websites block automated requests. If prices show as 'N/A' or seem incorrect, the websites may be blocking the requests. For accurate pricing, please visit the store websites directly."
                : "Prices are estimates and may vary by location. Please check with stores for current pricing."}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 48,
    paddingHorizontal: 16,
    paddingBottom: 120,
  },
  backButtonTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 8,
  },
  backButtonTopText: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.card,
    marginLeft: 4,
  },
  productCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  productHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productIconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productInfo: {
    marginLeft: 16,
    flex: 1,
  },
  productName: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
  },
  productDetails: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  statusCard: {
    backgroundColor: colors.secondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginLeft: 8,
  },
  statusText: {
    fontSize: 13,
    color: colors.text,
    lineHeight: 18,
  },
  statusTimestamp: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 13,
    color: colors.text,
    marginLeft: 12,
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 12,
    alignSelf: 'flex-start',
  },
  refreshButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    marginLeft: 6,
  },
  pricesSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.card,
    marginBottom: 16,
  },
  storeCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 2,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  storeCardLowest: {
    borderColor: colors.highlight,
    boxShadow: '0px 4px 12px rgba(255, 215, 0, 0.3)',
    elevation: 4,
  },
  storeCardError: {
    borderColor: colors.accent,
    opacity: 0.8,
  },
  storeCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  storeIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  storeInfo: {
    flex: 1,
    marginLeft: 16,
  },
  storeName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  storeLocation: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  errorMessage: {
    fontSize: 11,
    color: colors.accent,
    marginTop: 4,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
  },
  priceLowest: {
    color: colors.accent,
  },
  priceUnavailable: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  bestPriceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.highlight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 4,
  },
  bestPriceText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.text,
    marginLeft: 4,
  },
  savingsCard: {
    backgroundColor: colors.secondary,
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  savingsInfo: {
    marginLeft: 16,
    flex: 1,
  },
  savingsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  savingsAmount: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.primary,
    marginTop: 4,
  },
  savingsDescription: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  infoCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  infoTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  infoText: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
