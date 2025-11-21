
import React, { useMemo } from "react";
import { ScrollView, StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { colors } from "@/styles/commonStyles";
import { IconSymbol } from "@/components/IconSymbol";
import { useLocalSearchParams, useRouter } from "expo-router";

interface StorePrice {
  store: string;
  price: number;
  location: string;
  icon: string;
  color: string;
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

  const productData = useMemo(() => {
    return productsData[id as string];
  }, [id]);

  const storePrices: StorePrice[] = useMemo(() => {
    if (!productData) return [];
    
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
        icon: "storefront",
        color: "#0071CE",
      },
      {
        store: "Safeway",
        price: productData.prices.safeway,
        location: "Phoenix, AZ",
        icon: "storefront",
        color: "#E31837",
      },
    ];
  }, [productData]);

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

        <View style={styles.pricesSection}>
          <Text style={styles.sectionTitle}>Store Prices</Text>
          
          {storePrices.map((storePrice, index) => {
            const isLowest = storePrice.price === lowestPrice && storePrice.price > 0;
            
            return (
              <React.Fragment key={index}>
                <View 
                  style={[
                    styles.storeCard,
                    isLowest && styles.storeCardLowest,
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
