
import React from "react";
import { ScrollView, StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { colors } from "@/styles/commonStyles";
import { IconSymbol } from "@/components/IconSymbol";
import { useRouter } from "expo-router";

interface Product {
  id: string;
  name: string;
  description: string;
  icon: string;
  iosIcon: string;
}

const products: Product[] = [
  {
    id: "modelo-24",
    name: "Modelo Especial 24-Pack",
    description: "24 pack of 12 oz bottles",
    icon: "liquor",
    iosIcon: "sparkles",
  },
  {
    id: "high-noon-8",
    name: "High Noon Seltzer 8-Pack",
    description: "8 pack of hard seltzer",
    icon: "liquor",
    iosIcon: "sparkles",
  },
  {
    id: "chicken-breast",
    name: "Chicken Breast",
    description: "Price per pound",
    icon: "restaurant",
    iosIcon: "fork.knife",
  },
  {
    id: "ground-beef",
    name: "85% Lean Ground Beef",
    description: "Price per pound",
    icon: "restaurant",
    iosIcon: "fork.knife",
  },
  {
    id: "eggs-dozen",
    name: "Dozen Eggs",
    description: "12 large eggs",
    icon: "egg",
    iosIcon: "circle.grid.3x3.fill",
  },
];

export default function HomeScreen() {
  const router = useRouter();

  const handleProductPress = (productId: string) => {
    console.log("Navigating to product:", productId);
    router.push(`/(tabs)/(home)/product/${productId}`);
  };

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
            color={colors.card} 
          />
          <Text style={styles.title}>Grocery Price Comparison</Text>
          <Text style={styles.subtitle}>Compare prices across local stores</Text>
        </View>

        <View style={styles.productsSection}>
          <Text style={styles.sectionTitle}>Select a Product</Text>
          <Text style={styles.sectionSubtitle}>Tap any item to see pricing at Fry&apos;s, Walmart, and Safeway</Text>
          
          {products.map((product, index) => (
            <React.Fragment key={index}>
              <TouchableOpacity 
                style={styles.productCard}
                activeOpacity={0.7}
                onPress={() => handleProductPress(product.id)}
              >
                <View style={styles.productIconContainer}>
                  <IconSymbol 
                    ios_icon_name={product.iosIcon} 
                    android_material_icon_name={product.icon} 
                    size={32} 
                    color={colors.primary} 
                  />
                </View>
                
                <View style={styles.productInfo}>
                  <Text style={styles.productName}>{product.name}</Text>
                  <Text style={styles.productDescription}>{product.description}</Text>
                </View>
                
                <View style={styles.arrowContainer}>
                  <IconSymbol 
                    ios_icon_name="chevron.right" 
                    android_material_icon_name="chevron_right" 
                    size={24} 
                    color={colors.textSecondary} 
                  />
                </View>
              </TouchableOpacity>
            </React.Fragment>
          ))}
        </View>

        <View style={styles.infoCard}>
          <IconSymbol 
            ios_icon_name="info.circle.fill" 
            android_material_icon_name="info" 
            size={24} 
            color={colors.primary} 
          />
          <Text style={styles.infoText}>
            Prices are updated from store websites when available. Tap Modelo to see live price fetching in action!
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
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.card,
    marginTop: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.card,
    marginTop: 4,
    textAlign: 'center',
  },
  productsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.card,
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: colors.card,
    marginBottom: 16,
    lineHeight: 20,
  },
  productCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.secondary,
  },
  productIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productInfo: {
    flex: 1,
    marginLeft: 16,
  },
  productName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  productDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  arrowContainer: {
    marginLeft: 8,
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
