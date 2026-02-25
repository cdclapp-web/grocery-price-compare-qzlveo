
import React, { useState } from "react";
import { ScrollView, StyleSheet, View, Text, TouchableOpacity, Image } from "react-native";
import { colors } from "@/styles/commonStyles";
import { IconSymbol } from "@/components/IconSymbol";
import { useRouter } from "expo-router";
import SidebarMenu from "@/components/SidebarMenu";

// Product prices data
const productPrices = {
  "eggs-dozen": {
    frys: 2.98,
    walmart: 1.97,
    safeway: 4.99,
  },
  "chicken-breast": {
    frys: 4.99,
    walmart: 5.17,
    safeway: 8.99,
  },
  "ground-beef": {
    frys: 7.49,
    walmart: 7.32,
    safeway: 10.99,
  },
};

export default function HomeScreen() {
  const router = useRouter();
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const handleProductPress = (productId: string) => {
    console.log("Navigating to product:", productId);
    router.push(`/(tabs)/(home)/product/${productId}`);
  };

  const handleMenuPress = () => {
    console.log("Menu button pressed - opening sidebar");
    setSidebarVisible(true);
  };

  const handleCloseSidebar = () => {
    console.log("Closing sidebar");
    setSidebarVisible(false);
  };

  // Calculate lowest price for display
  const getLowestPrice = (productId: string) => {
    const prices = productPrices[productId as keyof typeof productPrices];
    return Math.min(prices.frys, prices.walmart, prices.safeway);
  };

  const eggsLowestPrice = getLowestPrice("eggs-dozen");
  const chickenLowestPrice = getLowestPrice("chicken-breast");
  const beefLowestPrice = getLowestPrice("ground-beef");

  const eggsWalmartPrice = productPrices["eggs-dozen"].walmart;
  const eggsSafewayPrice = productPrices["eggs-dozen"].safeway;

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with Logo and Menu */}
        <View style={styles.header}>
          <Image 
            source={require('@/assets/images/21f6dfa1-1184-43cc-a214-a344514546aa.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <TouchableOpacity 
            style={styles.menuButton}
            onPress={handleMenuPress}
            activeOpacity={0.7}
          >
            <IconSymbol 
              ios_icon_name="line.horizontal.3" 
              android_material_icon_name="menu" 
              size={32} 
              color={colors.card} 
            />
          </TouchableOpacity>
        </View>

        {/* Sample Products Row */}
        <View style={styles.sampleProductsSection}>
          <View style={styles.productsRow}>
            {/* Dozen Eggs */}
            <TouchableOpacity 
              style={styles.sampleProductCard}
              onPress={() => handleProductPress("eggs-dozen")}
              activeOpacity={0.7}
            >
              <View style={styles.sampleIconContainer}>
                <IconSymbol 
                  ios_icon_name="circle.grid.3x3.fill" 
                  android_material_icon_name="egg" 
                  size={28} 
                  color={colors.primary} 
                />
              </View>
              <Text style={styles.sampleProductName}>Dozen Eggs</Text>
              <Text style={styles.sampleProductPrice}>${eggsLowestPrice.toFixed(2)}</Text>
            </TouchableOpacity>

            {/* Chicken Breast */}
            <TouchableOpacity 
              style={styles.sampleProductCard}
              onPress={() => handleProductPress("chicken-breast")}
              activeOpacity={0.7}
            >
              <View style={styles.sampleIconContainer}>
                <IconSymbol 
                  ios_icon_name="fork.knife" 
                  android_material_icon_name="restaurant" 
                  size={28} 
                  color={colors.primary} 
                />
              </View>
              <Text style={styles.sampleProductName}>Chicken Breast</Text>
              <Text style={styles.sampleProductPrice}>${chickenLowestPrice.toFixed(2)}/lb</Text>
            </TouchableOpacity>

            {/* 85% Lean Ground Beef */}
            <TouchableOpacity 
              style={styles.sampleProductCard}
              onPress={() => handleProductPress("ground-beef")}
              activeOpacity={0.7}
            >
              <View style={styles.sampleIconContainer}>
                <IconSymbol 
                  ios_icon_name="fork.knife" 
                  android_material_icon_name="restaurant" 
                  size={28} 
                  color={colors.primary} 
                />
              </View>
              <Text style={styles.sampleProductName}>85% Lean Ground Beef</Text>
              <Text style={styles.sampleProductPrice}>${beefLowestPrice.toFixed(2)}/lb</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Price Comparison Preview */}
        <View style={styles.comparisonSection}>
          <Text style={styles.comparisonTitle}>Price Comparison Preview</Text>
          <Text style={styles.comparisonSubtitle}>Dozen Eggs</Text>
          
          <View style={styles.comparisonCards}>
            {/* Walmart */}
            <View style={styles.comparisonCard}>
              <View style={styles.storeIconContainer}>
                <IconSymbol 
                  ios_icon_name="storefront" 
                  android_material_icon_name="store" 
                  size={32} 
                  color="#0071CE" 
                />
              </View>
              <Text style={styles.storeName}>Walmart</Text>
              <Text style={styles.storePrice}>${eggsWalmartPrice.toFixed(2)}</Text>
            </View>

            {/* Safeway */}
            <View style={styles.comparisonCard}>
              <View style={styles.storeIconContainer}>
                <IconSymbol 
                  ios_icon_name="storefront" 
                  android_material_icon_name="store" 
                  size={32} 
                  color="#0055A5" 
                />
              </View>
              <Text style={styles.storeName}>Safeway</Text>
              <Text style={styles.storePrice}>${eggsSafewayPrice.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        {/* Descriptive Text Box */}
        <View style={styles.descriptionBox}>
          <Text style={styles.descriptionText}>
            Find the best prices for your favorite items at Price Pantry! Check out our price comparison, recent purchases, and grocery list tools, with many more features to come down the road.
          </Text>
        </View>
      </ScrollView>

      {/* Sidebar Menu */}
      <SidebarMenu visible={sidebarVisible} onClose={handleCloseSidebar} />
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
  header: {
    alignItems: 'center',
    marginBottom: 32,
    position: 'relative',
  },
  logo: {
    width: 120,
    height: 120,
  },
  menuButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    padding: 8,
  },
  sampleProductsSection: {
    marginBottom: 32,
  },
  productsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  sampleProductCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  sampleIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  sampleProductName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 18,
  },
  sampleProductPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
    textAlign: 'center',
  },
  comparisonSection: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  comparisonTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  comparisonSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 16,
    textAlign: 'center',
  },
  comparisonCards: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 16,
  },
  comparisonCard: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.backgroundAlt,
    borderRadius: 8,
  },
  storeIconContainer: {
    marginBottom: 8,
  },
  storeName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  storePrice: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
    textAlign: 'center',
  },
  descriptionBox: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 20,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  descriptionText: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
    textAlign: 'center',
  },
});
