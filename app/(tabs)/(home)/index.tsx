
import React, { useState } from "react";
import { ScrollView, StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { colors } from "@/styles/commonStyles";
import { IconSymbol } from "@/components/IconSymbol";

interface StorePrice {
  store: string;
  price: number;
  location: string;
  icon: string;
  color: string;
}

export default function HomeScreen() {
  const [storePrices] = useState<StorePrice[]>([
    {
      store: "Fry's Food Store",
      price: 24.99,
      location: "Phoenix, AZ",
      icon: "storefront",
      color: "#0066CC",
    },
    {
      store: "Walmart",
      price: 22.98,
      location: "Phoenix, AZ",
      icon: "shopping_cart",
      color: "#0071CE",
    },
    {
      store: "Safeway",
      price: 26.49,
      location: "Phoenix, AZ",
      icon: "local_grocery_store",
      color: "#E31837",
    },
  ]);

  const lowestPrice = Math.min(...storePrices.map(sp => sp.price));

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <IconSymbol 
            ios_icon_name="cart.fill" 
            android_material_icon_name="shopping_cart" 
            size={48} 
            color={colors.primary} 
          />
          <Text style={styles.title}>Grocery Price Comparison</Text>
          <Text style={styles.subtitle}>Find the best deals in your area</Text>
        </View>

        <View style={styles.productCard}>
          <View style={styles.productHeader}>
            <IconSymbol 
              ios_icon_name="wineglass.fill" 
              android_material_icon_name="local_bar" 
              size={32} 
              color={colors.accent} 
            />
            <View style={styles.productInfo}>
              <Text style={styles.productName}>Modelo Especial</Text>
              <Text style={styles.productDetails}>24-Pack (12 oz cans)</Text>
            </View>
          </View>
        </View>

        <View style={styles.pricesSection}>
          <Text style={styles.sectionTitle}>Store Prices</Text>
          
          {storePrices.map((storePrice, index) => {
            const isLowest = storePrice.price === lowestPrice;
            
            return (
              <React.Fragment key={index}>
                <TouchableOpacity 
                  style={[
                    styles.storeCard,
                    isLowest && styles.storeCardLowest
                  ]}
                  activeOpacity={0.7}
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
                    </View>
                  </View>
                </TouchableOpacity>
              </React.Fragment>
            );
          })}
        </View>

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
              Save up to ${(Math.max(...storePrices.map(sp => sp.price)) - lowestPrice).toFixed(2)}
            </Text>
            <Text style={styles.savingsDescription}>
              by shopping at the lowest priced store
            </Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <IconSymbol 
            ios_icon_name="info.circle.fill" 
            android_material_icon_name="info" 
            size={24} 
            color={colors.primary} 
          />
          <Text style={styles.infoText}>
            Prices are estimates and may vary by location. Please check with stores for current pricing.
          </Text>
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
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    marginTop: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
  productCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  productHeader: {
    flexDirection: 'row',
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
    color: colors.text,
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
  infoText: {
    fontSize: 13,
    color: colors.textSecondary,
    marginLeft: 12,
    flex: 1,
    lineHeight: 18,
  },
});
