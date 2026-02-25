
import React, { useMemo, useState, useEffect } from "react";
import { ScrollView, StyleSheet, View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { colors } from "@/styles/commonStyles";
import { IconSymbol } from "@/components/IconSymbol";
import { useLocalSearchParams, useRouter } from "expo-router";

interface ProductPriceOption {
  brand: string;
  price: number;
  store: 'Fry\'s' | 'Walmart' | 'Safeway';
  productName: string;
}

interface ProductData {
  id: string;
  name: string;
  description: string;
  icon: string;
  iosIcon: string;
  priceOptions: ProductPriceOption[];
}

const productsData: Record<string, ProductData> = {
  "modelo-24": {
    id: "modelo-24",
    name: "Modelo Especial 24-Pack",
    description: "24 pack of 12 oz bottles",
    icon: "liquor",
    iosIcon: "sparkles",
    priceOptions: [
      { brand: 'Modelo', price: 27.94, store: 'Walmart', productName: 'Modelo Especial 24-Pack' },
      { brand: 'Modelo', price: 28.88, store: 'Safeway', productName: 'Modelo Especial 24-Pack' },
      { brand: 'Modelo', price: 29.99, store: 'Fry\'s', productName: 'Modelo Especial 24-Pack' },
    ],
  },
  "high-noon-8": {
    id: "high-noon-8",
    name: "High Noon Seltzer 8-Pack",
    description: "8 pack of hard seltzer",
    icon: "liquor",
    iosIcon: "sparkles",
    priceOptions: [
      { brand: 'High Noon', price: 15.99, store: 'Fry\'s', productName: 'High Noon Seltzer 8-Pack' },
      { brand: 'High Noon', price: 15.99, store: 'Safeway', productName: 'High Noon Seltzer 8-Pack' },
      { brand: 'High Noon', price: 17.87, store: 'Walmart', productName: 'High Noon Seltzer 8-Pack' },
    ],
  },
  "chicken-breast": {
    id: "chicken-breast",
    name: "Chicken Breast",
    description: "Price per pound",
    icon: "restaurant",
    iosIcon: "fork.knife",
    priceOptions: [
      { brand: 'Foster Farms', price: 4.99, store: 'Fry\'s', productName: 'Foster Farms Chicken Breast' },
      { brand: 'Foster Farms', price: 5.17, store: 'Walmart', productName: 'Foster Farms Chicken Breast' },
      { brand: 'Kroger', price: 5.49, store: 'Fry\'s', productName: 'Kroger Chicken Breast' },
      { brand: 'Simple Truth Organic', price: 7.99, store: 'Walmart', productName: 'Simple Truth Organic Chicken Breast' },
      { brand: 'Heritage Farm', price: 8.49, store: 'Safeway', productName: 'Heritage Farm Chicken Breast' },
      { brand: 'Foster Farms', price: 8.99, store: 'Safeway', productName: 'Foster Farms Chicken Breast' },
      { brand: 'Simple Truth Organic', price: 9.99, store: 'Safeway', productName: 'Simple Truth Organic Chicken Breast' },
    ],
  },
  "ground-beef": {
    id: "ground-beef",
    name: "85% Lean Ground Beef",
    description: "Price per pound",
    icon: "restaurant",
    iosIcon: "fork.knife",
    priceOptions: [
      { brand: 'Store Brand', price: 7.32, store: 'Walmart', productName: '85% Lean Ground Beef' },
      { brand: 'Store Brand', price: 7.49, store: 'Fry\'s', productName: '85% Lean Ground Beef' },
      { brand: 'Certified Angus', price: 9.99, store: 'Walmart', productName: 'Certified Angus 85% Lean Ground Beef' },
      { brand: 'Store Brand', price: 10.99, store: 'Safeway', productName: '85% Lean Ground Beef' },
      { brand: 'Organic Valley', price: 12.99, store: 'Safeway', productName: 'Organic Valley 85% Lean Ground Beef' },
    ],
  },
  "eggs-dozen": {
    id: "eggs-dozen",
    name: "Dozen Eggs",
    description: "12 large eggs",
    icon: "egg",
    iosIcon: "circle.grid.3x3.fill",
    priceOptions: [
      { brand: 'Great Value', price: 1.97, store: 'Walmart', productName: 'Great Value Large Eggs' },
      { brand: 'Kroger', price: 2.98, store: 'Fry\'s', productName: 'Kroger Large Eggs' },
      { brand: 'Eggland\'s Best', price: 4.49, store: 'Walmart', productName: 'Eggland\'s Best Large Eggs' },
      { brand: 'O Organics', price: 4.99, store: 'Safeway', productName: 'O Organics Large Eggs' },
      { brand: 'Vital Farms', price: 6.99, store: 'Safeway', productName: 'Vital Farms Pasture-Raised Eggs' },
    ],
  },
};

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showMoreOptions, setShowMoreOptions] = useState(false);

  const productData = useMemo(() => {
    return productsData[id as string];
  }, [id]);

  const sortedPriceOptions = useMemo(() => {
    if (!productData) return [];
    const sorted = [...productData.priceOptions].sort((a, b) => a.price - b.price);
    return sorted;
  }, [productData]);

  const lowestPriceOption = useMemo(() => {
    return sortedPriceOptions.length > 0 ? sortedPriceOptions[0] : null;
  }, [sortedPriceOptions]);

  const additionalOptions = useMemo(() => {
    return sortedPriceOptions.slice(1);
  }, [sortedPriceOptions]);

  const getStoreColor = (store: string) => {
    const storeColorMap: Record<string, string> = {
      'Fry\'s': colors.frysRed,
      'Walmart': colors.walmartBlue,
      'Safeway': colors.safewayRed,
    };
    return storeColorMap[store] || colors.primary;
  };

  const handleToggleMoreOptions = () => {
    console.log('Toggling more options:', !showMoreOptions);
    setShowMoreOptions(!showMoreOptions);
  };

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

  const lowestPriceText = lowestPriceOption ? `$${lowestPriceOption.price.toFixed(2)}` : 'N/A';
  const hasMoreOptions = additionalOptions.length > 0;

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

        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Loading prices...</Text>
          </View>
        )}

        <View style={styles.pricesSection}>
          <Text style={styles.sectionTitle}>Best Price</Text>
          
          {lowestPriceOption && (
            <View style={[styles.priceCard, styles.priceCardLowest]}>
              <View style={styles.priceCardContent}>
                <View style={[styles.storeIconContainer, { backgroundColor: getStoreColor(lowestPriceOption.store) }]}>
                  <IconSymbol 
                    ios_icon_name="storefront" 
                    android_material_icon_name="store" 
                    size={28} 
                    color="#FFFFFF" 
                  />
                </View>
                
                <View style={styles.priceInfo}>
                  <Text style={styles.brandName}>{lowestPriceOption.brand}</Text>
                  <Text style={styles.storeName}>{lowestPriceOption.store}</Text>
                  <Text style={styles.productNameText}>{lowestPriceOption.productName}</Text>
                </View>
                
                <View style={styles.priceContainer}>
                  <Text style={[styles.price, styles.priceLowest]}>{lowestPriceText}</Text>
                  <View style={styles.bestPriceBadge}>
                    <IconSymbol 
                      ios_icon_name="star.fill" 
                      android_material_icon_name="star" 
                      size={14} 
                      color={colors.highlight} 
                    />
                    <Text style={styles.bestPriceText}>Best Price</Text>
                  </View>
                </View>
              </View>
            </View>
          )}

          {hasMoreOptions && (
            <TouchableOpacity 
              style={styles.moreOptionsButton}
              onPress={handleToggleMoreOptions}
              activeOpacity={0.7}
            >
              <Text style={styles.moreOptionsText}>
                {showMoreOptions ? 'Hide Options' : 'More Options'}
              </Text>
              <IconSymbol 
                ios_icon_name={showMoreOptions ? "chevron.up" : "chevron.down"} 
                android_material_icon_name={showMoreOptions ? "keyboard-arrow-up" : "keyboard-arrow-down"} 
                size={20} 
                color={colors.primary} 
              />
            </TouchableOpacity>
          )}

          {showMoreOptions && additionalOptions.map((option, index) => {
            const priceText = `$${option.price.toFixed(2)}`;
            
            return (
              <React.Fragment key={index}>
                <View style={styles.priceCard}>
                  <View style={styles.priceCardContent}>
                    <View style={[styles.storeIconContainer, { backgroundColor: getStoreColor(option.store) }]}>
                      <IconSymbol 
                        ios_icon_name="storefront" 
                        android_material_icon_name="store" 
                        size={28} 
                        color="#FFFFFF" 
                      />
                    </View>
                    
                    <View style={styles.priceInfo}>
                      <Text style={styles.brandName}>{option.brand}</Text>
                      <Text style={styles.storeName}>{option.store}</Text>
                      <Text style={styles.productNameText}>{option.productName}</Text>
                    </View>
                    
                    <View style={styles.priceContainer}>
                      <Text style={styles.price}>{priceText}</Text>
                    </View>
                  </View>
                </View>
              </React.Fragment>
            );
          })}
        </View>

        {lowestPriceOption && additionalOptions.length > 0 && (
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
                Save up to ${(additionalOptions[additionalOptions.length - 1].price - lowestPriceOption.price).toFixed(2)}
              </Text>
              <Text style={styles.savingsDescription}>
                by choosing the lowest priced option
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
  loadingContainer: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 24,
    marginBottom: 16,
    alignItems: 'center',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginTop: 12,
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
  priceCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 2,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  priceCardLowest: {
    borderColor: colors.highlight,
    boxShadow: '0px 4px 12px rgba(255, 215, 0, 0.3)',
    elevation: 4,
  },
  priceCardContent: {
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
  priceInfo: {
    flex: 1,
    marginLeft: 16,
  },
  brandName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  storeName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginTop: 2,
  },
  productNameText: {
    fontSize: 13,
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
  moreOptionsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
    boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  moreOptionsText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    marginRight: 8,
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
