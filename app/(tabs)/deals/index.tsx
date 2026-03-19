
import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  Animated,
  Pressable,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { IconSymbol } from '@/components/IconSymbol';
import { colors } from '@/styles/commonStyles';
import { useRouter } from 'expo-router';

const STORES = [
  {
    key: 'frys',
    label: "Fry's",
    url: 'https://www.frysfood.com/savings/cl/coupons/',
    location: 'Rural Southern: 3255 S Rural Rd, Tempe, AZ 85282',
    accentColor: colors.frysRed,
  },
  {
    key: 'walmart',
    label: 'Walmart',
    url: 'https://www.walmart.com/shop/deals/flash-deals?athAsset=eyJhdGhjcGlkIjoiNTUyNDZkNDYtMWJmYi00ZDQ0LWIzNWQtYzk0NmUxNmMyNjA2IiwiYXRoem5pZCI6Ikl0ZW1DYXJvdXNlbF81NTI0NmQ0Ni0xYmZiLTRkNDQtYjM1ZC1jOTQ2ZTE2YzI2MDZfaXRlbXMiLCJhdGhtdGlkIjoiQXRoZW5hSXRlbUNhcm91c2VsIiwiYXRodHZpZCI6IjEifQ==&athena=true',
    location: 'Tempe East Southern Ave Supercenter: 800 E Southern Ave, Tempe, AZ 85282',
    accentColor: colors.walmartBlue,
  },
  {
    key: 'safeway',
    label: 'Safeway',
    url: 'https://www.safeway.com/weeklyad',
    location: '926 E Broadway Rd, Tempe, AZ 85282',
    accentColor: colors.safewayRed,
  },
] as const;

type StoreKey = typeof STORES[number]['key'];

export default function DealsScreen() {
  const router = useRouter();
  const [activeStore, setActiveStore] = useState<StoreKey>('frys');
  const [loadingStates, setLoadingStates] = useState<Record<StoreKey, boolean>>({
    frys: true,
    walmart: true,
    safeway: true,
  });
  const [refreshKeys, setRefreshKeys] = useState<Record<StoreKey, number>>({
    frys: 0,
    walmart: 0,
    safeway: 0,
  });

  const webViewRefs = useRef<Record<StoreKey, React.RefObject<WebView | null>>>({
    frys: React.createRef<WebView>(),
    walmart: React.createRef<WebView>(),
    safeway: React.createRef<WebView>(),
  });

  const activeStoreData = STORES.find(s => s.key === activeStore)!;
  const isLoading = loadingStates[activeStore];

  const handleTabPress = (key: StoreKey) => {
    console.log(`[Deals] Tab pressed: ${key}`);
    setActiveStore(key);
  };

  const handleRefresh = () => {
    console.log(`[Deals] Refresh pressed for store: ${activeStore}`);
    setLoadingStates(prev => ({ ...prev, [activeStore]: true }));
    setRefreshKeys(prev => ({ ...prev, [activeStore]: prev[activeStore] + 1 }));
  };

  const handleWebViewLoadStart = (key: StoreKey) => {
    console.log(`[Deals] WebView load started: ${key}`);
    setLoadingStates(prev => ({ ...prev, [key]: true }));
  };

  const handleWebViewLoadEnd = (key: StoreKey) => {
    console.log(`[Deals] WebView load finished: ${key}`);
    setLoadingStates(prev => ({ ...prev, [key]: false }));
  };

  const handleWebViewError = (key: StoreKey, error: string) => {
    console.log(`[Deals] WebView error for ${key}:`, error);
    setLoadingStates(prev => ({ ...prev, [key]: false }));
  };

  const handleBackPress = () => {
    console.log('[Deals] Back button pressed');
    router.back();
  };

  const accentColor = activeStoreData.accentColor;

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBackPress}
          activeOpacity={0.7}
          accessibilityLabel="Go back"
        >
          <IconSymbol
            ios_icon_name="chevron.left"
            android_material_icon_name="chevron_left"
            size={22}
            color={colors.card}
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Current Deals</Text>

        <TouchableOpacity
          style={styles.refreshButton}
          onPress={handleRefresh}
          activeOpacity={0.7}
          accessibilityLabel="Refresh deals page"
        >
          <IconSymbol
            ios_icon_name="arrow.clockwise"
            android_material_icon_name="refresh"
            size={22}
            color={colors.card}
          />
        </TouchableOpacity>
      </View>

      {/* Segmented Control */}
      <View style={styles.segmentedControl}>
        {STORES.map(store => {
          const isActive = activeStore === store.key;
          return (
            <TouchableOpacity
              key={store.key}
              style={[
                styles.segmentTab,
                isActive && { backgroundColor: store.accentColor },
              ]}
              onPress={() => handleTabPress(store.key)}
              activeOpacity={0.75}
            >
              <Text
                style={[
                  styles.segmentTabText,
                  isActive && styles.segmentTabTextActive,
                ]}
              >
                {store.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Store Info Bar */}
      <View style={[styles.storeInfoBar, { borderLeftColor: accentColor }]}>
        <View style={styles.storeInfoContent}>
          <Text style={styles.storeInfoName}>{activeStoreData.label}</Text>
          <Text style={styles.storeInfoLocation} numberOfLines={1} ellipsizeMode="tail">
            {activeStoreData.location}
          </Text>
        </View>
        {isLoading && (
          <ActivityIndicator size="small" color={accentColor} style={styles.inlineSpinner} />
        )}
      </View>

      {/* WebViews — all mounted, only active one visible */}
      <View style={styles.webViewContainer}>
        {STORES.map(store => (
          <View
            key={store.key}
            style={[
              styles.webViewWrapper,
              activeStore !== store.key && styles.webViewHidden,
            ]}
          >
            <WebView
              ref={webViewRefs.current[store.key]}
              key={refreshKeys[store.key]}
              source={{ uri: store.url }}
              style={styles.webView}
              onLoadStart={() => handleWebViewLoadStart(store.key)}
              onLoadEnd={() => handleWebViewLoadEnd(store.key)}
              onError={e => handleWebViewError(store.key, e.nativeEvent.description)}
              javaScriptEnabled
              domStorageEnabled
              startInLoadingState={false}
              userAgent="Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1"
            />
            {loadingStates[store.key] && activeStore === store.key && (
              <View style={styles.loadingOverlay}>
                <ActivityIndicator size="large" color={store.accentColor} />
                <Text style={styles.loadingText}>Loading {store.label} deals...</Text>
              </View>
            )}
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.background,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.card,
    letterSpacing: -0.3,
  },
  refreshButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  segmentedControl: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: colors.backgroundAlt,
    borderRadius: 10,
    padding: 4,
    gap: 4,
  },
  segmentTab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  segmentTabTextActive: {
    color: colors.card,
  },
  storeInfoBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 8,
    backgroundColor: colors.card,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderLeftWidth: 4,
    boxShadow: '0px 1px 4px rgba(0,0,0,0.08)',
    elevation: 2,
  },
  storeInfoContent: {
    flex: 1,
  },
  storeInfoName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 2,
  },
  storeInfoLocation: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 16,
  },
  inlineSpinner: {
    marginLeft: 8,
  },
  webViewContainer: {
    flex: 1,
    marginHorizontal: 0,
    overflow: 'hidden',
  },
  webViewWrapper: {
    ...StyleSheet.absoluteFillObject,
  },
  webViewHidden: {
    opacity: 0,
    pointerEvents: 'none',
  },
  webView: {
    flex: 1,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.backgroundAlt,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textSecondary,
  },
});
