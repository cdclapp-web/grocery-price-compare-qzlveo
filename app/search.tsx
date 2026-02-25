
import React, { useState, useMemo } from "react";
import { ScrollView, StyleSheet, View, Text, TextInput, TouchableOpacity } from "react-native";
import { colors } from "@/styles/commonStyles";
import { IconSymbol } from "@/components/IconSymbol";
import { Stack, useRouter } from "expo-router";

interface ProductPriceOption {
  brand: string;
  price: number;
  store: 'Fry\'s' | 'Walmart' | 'Safeway';
  productName: string;
  category: string;
}

// All available products across all stores
const allProducts: ProductPriceOption[] = [
  // Modelo
  { brand: 'Modelo', price: 27.94, store: 'Walmart', productName: 'Modelo Especial 24-Pack', category: 'Beer' },
  { brand: 'Modelo', price: 28.88, store: 'Safeway', productName: 'Modelo Especial 24-Pack', category: 'Beer' },
  { brand: 'Modelo', price: 29.99, store: 'Fry\'s', productName: 'Modelo Especial 24-Pack', category: 'Beer' },
  
  // High Noon
  { brand: 'High Noon', price: 15.99, store: 'Fry\'s', productName: 'High Noon Seltzer 8-Pack', category: 'Seltzer' },
  { brand: 'High Noon', price: 15.99, store: 'Safeway', productName: 'High Noon Seltzer 8-Pack', category: 'Seltzer' },
  { brand: 'High Noon', price: 17.87, store: 'Walmart', productName: 'High Noon Seltzer 8-Pack', category: 'Seltzer' },
  
  // Chicken Breast
  { brand: 'Foster Farms', price: 4.99, store: 'Fry\'s', productName: 'Foster Farms Chicken Breast', category: 'Meat' },
  { brand: 'Foster Farms', price: 5.17, store: 'Walmart', productName: 'Foster Farms Chicken Breast', category: 'Meat' },
  { brand: 'Kroger', price: 5.49, store: 'Fry\'s', productName: 'Kroger Chicken Breast', category: 'Meat' },
  { brand: 'Simple Truth Organic', price: 7.99, store: 'Walmart', productName: 'Simple Truth Organic Chicken Breast', category: 'Meat' },
  { brand: 'Heritage Farm', price: 8.49, store: 'Safeway', productName: 'Heritage Farm Chicken Breast', category: 'Meat' },
  { brand: 'Foster Farms', price: 8.99, store: 'Safeway', productName: 'Foster Farms Chicken Breast', category: 'Meat' },
  { brand: 'Simple Truth Organic', price: 9.99, store: 'Safeway', productName: 'Simple Truth Organic Chicken Breast', category: 'Meat' },
  
  // Ground Beef
  { brand: 'Store Brand', price: 7.32, store: 'Walmart', productName: '85% Lean Ground Beef', category: 'Meat' },
  { brand: 'Store Brand', price: 7.49, store: 'Fry\'s', productName: '85% Lean Ground Beef', category: 'Meat' },
  { brand: 'Certified Angus', price: 9.99, store: 'Walmart', productName: 'Certified Angus 85% Lean Ground Beef', category: 'Meat' },
  { brand: 'Store Brand', price: 10.99, store: 'Safeway', productName: '85% Lean Ground Beef', category: 'Meat' },
  { brand: 'Organic Valley', price: 12.99, store: 'Safeway', productName: 'Organic Valley 85% Lean Ground Beef', category: 'Meat' },
  
  // Eggs
  { brand: 'Great Value', price: 1.97, store: 'Walmart', productName: 'Great Value Large Eggs', category: 'Dairy' },
  { brand: 'Kroger', price: 2.98, store: 'Fry\'s', productName: 'Kroger Large Eggs', category: 'Dairy' },
  { brand: 'Eggland\'s Best', price: 4.49, store: 'Walmart', productName: 'Eggland\'s Best Large Eggs', category: 'Dairy' },
  { brand: 'O Organics', price: 4.99, store: 'Safeway', productName: 'O Organics Large Eggs', category: 'Dairy' },
  { brand: 'Vital Farms', price: 6.99, store: 'Safeway', productName: 'Vital Farms Pasture-Raised Eggs', category: 'Dairy' },
];

export default function SearchScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) {
      return [];
    }

    const query = searchQuery.toLowerCase();
    const filtered = allProducts.filter(product => {
      const productNameMatch = product.productName.toLowerCase().includes(query);
      const brandMatch = product.brand.toLowerCase().includes(query);
      const storeMatch = product.store.toLowerCase().includes(query);
      const categoryMatch = product.category.toLowerCase().includes(query);
      
      return productNameMatch || brandMatch || storeMatch || categoryMatch;
    });

    const sorted = filtered.sort((a, b) => a.price - b.price);
    return sorted;
  }, [searchQuery]);

  const getStoreColor = (store: string) => {
    const storeColorMap: Record<string, string> = {
      'Fry\'s': colors.frysRed,
      'Walmart': colors.walmartBlue,
      'Safeway': colors.safewayRed,
    };
    return storeColorMap[store] || colors.primary;
  };

  const handleClearSearch = () => {
    console.log('Clearing search');
    setSearchQuery('');
  };

  const resultCountText = searchResults.length === 1 ? '1 result' : `${searchResults.length} results`;
  const showResults = searchQuery.trim().length > 0;

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          headerShown: true,
          title: 'Search Items',
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.card,
          headerTitleStyle: {
            fontWeight: '700',
          },
        }} 
      />
      
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <IconSymbol 
            ios_icon_name="magnifyingglass" 
            android_material_icon_name="search" 
            size={20} 
            color={colors.textSecondary} 
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for products, brands, or stores..."
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={handleClearSearch} activeOpacity={0.7}>
              <IconSymbol 
                ios_icon_name="xmark.circle.fill" 
                android_material_icon_name="cancel" 
                size={20} 
                color={colors.textSecondary} 
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {!showResults && (
          <View style={styles.emptyState}>
            <IconSymbol 
              ios_icon_name="magnifyingglass" 
              android_material_icon_name="search" 
              size={64} 
              color={colors.textSecondary} 
            />
            <Text style={styles.emptyStateTitle}>Search for Items</Text>
            <Text style={styles.emptyStateText}>
              Find products from Fry&apos;s, Walmart, and Safeway
            </Text>
          </View>
        )}

        {showResults && searchResults.length === 0 && (
          <View style={styles.emptyState}>
            <IconSymbol 
              ios_icon_name="exclamationmark.triangle" 
              android_material_icon_name="warning" 
              size={64} 
              color={colors.textSecondary} 
            />
            <Text style={styles.emptyStateTitle}>No Results Found</Text>
            <Text style={styles.emptyStateText}>
              Try searching for different keywords
            </Text>
          </View>
        )}

        {showResults && searchResults.length > 0 && (
          <View style={styles.resultsSection}>
            <Text style={styles.resultsCount}>{resultCountText}</Text>
            
            {searchResults.map((result, index) => {
              const priceText = `$${result.price.toFixed(2)}`;
              
              return (
                <React.Fragment key={index}>
                  <View style={styles.resultCard}>
                    <View style={styles.resultCardContent}>
                      <View style={[styles.storeIconContainer, { backgroundColor: getStoreColor(result.store) }]}>
                        <IconSymbol 
                          ios_icon_name="storefront" 
                          android_material_icon_name="store" 
                          size={24} 
                          color="#FFFFFF" 
                        />
                      </View>
                      
                      <View style={styles.resultInfo}>
                        <Text style={styles.resultBrand}>{result.brand}</Text>
                        <Text style={styles.resultProductName}>{result.productName}</Text>
                        <View style={styles.resultMeta}>
                          <Text style={styles.resultStore}>{result.store}</Text>
                          <Text style={styles.resultCategory}>{result.category}</Text>
                        </View>
                      </View>
                      
                      <View style={styles.resultPriceContainer}>
                        <Text style={styles.resultPrice}>{priceText}</Text>
                      </View>
                    </View>
                  </View>
                </React.Fragment>
              );
            })}
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
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.background,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    marginLeft: 12,
    marginRight: 12,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 32,
  },
  emptyStateTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.card,
    marginTop: 24,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: colors.card,
    marginTop: 12,
    textAlign: 'center',
    opacity: 0.8,
  },
  resultsSection: {
    marginTop: 8,
  },
  resultsCount: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.card,
    marginBottom: 16,
  },
  resultCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  resultCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  storeIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultInfo: {
    flex: 1,
    marginLeft: 16,
  },
  resultBrand: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  resultProductName: {
    fontSize: 14,
    color: colors.text,
    marginTop: 2,
  },
  resultMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  resultStore: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  resultCategory: {
    fontSize: 13,
    color: colors.textSecondary,
    marginLeft: 8,
    paddingLeft: 8,
    borderLeftWidth: 1,
    borderLeftColor: colors.textSecondary,
  },
  resultPriceContainer: {
    alignItems: 'flex-end',
  },
  resultPrice: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
  },
});
