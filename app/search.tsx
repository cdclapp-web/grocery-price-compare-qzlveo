import React, { useMemo, useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  SafeAreaView,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Linking,
} from 'react-native';
import { WebView } from 'react-native-webview';
import type { WebView as WebViewType } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { colors } from '@/styles/commonStyles';
import { useShoppingList } from '@/contexts/ShoppingListContext';

const PRIMARY_GREEN = '#51B336';

const STORES = [
  {
    key: 'walmart',
    label: 'Walmart',
    accentColor: colors.walmartBlue,
    buildUrl: (q: string) => `https://www.walmart.com/search?q=${encodeURIComponent(q)}`,
  },
  {
    key: 'frys',
    label: "Fry's",
    accentColor: colors.frysRed,
    buildUrl: (q: string) => `https://www.frysfood.com/search?query=${encodeURIComponent(q)}`,
  },
  {
    key: 'safeway',
    label: 'Safeway',
    accentColor: colors.safewayRed,
    buildUrl: (q: string) => `https://www.safeway.com/shop/search-results.html?q=${encodeURIComponent(q)}`,
  },
] as const;

type StoreKey = typeof STORES[number]['key'];
type StoreMap<T> = Record<StoreKey, T>;

const createStoreMap = <T,>(factory: (store: typeof STORES[number]) => T): StoreMap<T> =>
  STORES.reduce((acc, store) => {
    acc[store.key] = factory(store);
    return acc;
  }, {} as StoreMap<T>);

export default function SearchScreen() {
  const router = useRouter();
  const { addItem } = useShoppingList();

  const [query, setQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');
  const [loadingStates, setLoadingStates] = useState<StoreMap<boolean>>(() => createStoreMap(() => false));
  const [pageTitles, setPageTitles] = useState<StoreMap<string>>(() => createStoreMap(() => ''));
  const [pageUrls, setPageUrls] = useState<StoreMap<string>>(() => createStoreMap(store => store.buildUrl('grocery')));
  const [toastMessage, setToastMessage] = useState('Added to Shopping List');

  const toastOpacity = useRef(new Animated.Value(0)).current;
  const webViewRefs = useRef<Partial<Record<StoreKey, WebViewType | null>>>({});

  const webViewUrls = useMemo(() => {
    const currentQuery = submittedQuery || 'grocery';
    return createStoreMap(store => store.buildUrl(currentQuery));
  }, [submittedQuery]);

  const handleSearch = useCallback(() => {
    const trimmed = query.trim();
    console.log('[Search] Comparison search submitted, query:', trimmed);
    if (trimmed) {
      setSubmittedQuery(trimmed);
    }
  }, [query]);

  const handleClearQuery = useCallback(() => {
    console.log('[Search] Clear search pressed');
    setQuery('');
    setSubmittedQuery('');
    setPageTitles(createStoreMap(() => ''));
    setPageUrls(createStoreMap(store => store.buildUrl('grocery')));
  }, []);

  const showToast = useCallback((message: string) => {
    setToastMessage(message);
    Animated.sequence([
      Animated.timing(toastOpacity, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.delay(1600),
      Animated.timing(toastOpacity, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start();
  }, [toastOpacity]);

  const handleAddToList = useCallback(async (storeKey: StoreKey) => {
    const store = STORES.find(item => item.key === storeKey)!;
    const itemTitle = pageTitles[storeKey] || submittedQuery || `Item from ${store.label}`;
    const itemUrl = pageUrls[storeKey] || webViewUrls[storeKey];

    console.log('[Search] Add to Shopping List pressed:', store.label, itemUrl, itemTitle);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    addItem({
      id: `${Date.now()}-${storeKey}`,
      name: itemTitle,
      store: store.label,
      url: itemUrl,
      addedAt: new Date().toISOString(),
    });

    showToast(`Added ${store.label} result`);
  }, [addItem, pageTitles, pageUrls, showToast, submittedQuery, webViewUrls]);

  const handleOpenStore = useCallback(async (storeKey: StoreKey) => {
    const targetUrl = pageUrls[storeKey] || webViewUrls[storeKey];
    console.log('[Search] Open store result:', storeKey, targetUrl);
    await Linking.openURL(targetUrl);
  }, [pageUrls, webViewUrls]);

  const handleWebViewLoadStart = useCallback((storeKey: StoreKey) => {
    console.log('[Search] WebView load started:', storeKey);
    setLoadingStates(prev => ({ ...prev, [storeKey]: true }));
  }, []);

  const handleWebViewLoadEnd = useCallback((storeKey: StoreKey) => {
    console.log('[Search] WebView load finished:', storeKey);
    setLoadingStates(prev => ({ ...prev, [storeKey]: false }));
    webViewRefs.current[storeKey]?.injectJavaScript(`
      (function() {
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'title', value: document.title }));
      })();
      true;
    `);
  }, []);

  const handleWebViewMessage = useCallback((storeKey: StoreKey, data: string) => {
    try {
      const message = JSON.parse(data);
      if (message.type === 'title' && typeof message.value === 'string') {
        console.log('[Search] WebView title updated:', storeKey, message.value);
        setPageTitles(prev => ({ ...prev, [storeKey]: message.value }));
      }
    } catch {
      // Ignore malformed messages from vendor pages.
    }
  }, []);

  const handleNavigationStateChange = useCallback((storeKey: StoreKey, url: string) => {
    console.log('[Search] Navigation state changed:', storeKey, url);
    setPageUrls(prev => ({ ...prev, [storeKey]: url }));
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerIconBtn}
          onPress={() => {
            console.log('[Search] Back button pressed');
            router.back();
          }}
          activeOpacity={0.7}
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={22} color={colors.card} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Compare Items</Text>
        <View style={styles.headerIconBtn} />
      </View>

      <View style={styles.searchRow}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={18} color={colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search once and compare all stores..."
            placeholderTextColor={colors.textSecondary}
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
            autoCapitalize="none"
            autoCorrect={false}
          />
          {query.length > 0 && (
            <TouchableOpacity
              onPress={handleClearQuery}
              activeOpacity={0.7}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="close-circle" size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch} activeOpacity={0.8}>
          <Text style={styles.searchButtonText}>Go</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.summaryBanner}>
        <Ionicons name="git-compare-outline" size={18} color={colors.card} />
        <Text style={styles.summaryBannerText}>
          {submittedQuery
            ? `Showing "${submittedQuery}" across all stores`
            : 'Search once to load matching results from Walmart, Fry\'s, and Safeway'}
        </Text>
      </View>

      <KeyboardAvoidingView
        style={styles.contentArea}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {STORES.map(store => {
            const title = pageTitles[store.key];
            const currentUrl = pageUrls[store.key] || webViewUrls[store.key];
            const isLoading = loadingStates[store.key];

            return (
              <View key={store.key} style={styles.storeCard}>
                <View style={styles.storeHeader}>
                  <View style={styles.storeTitleRow}>
                    <View style={[styles.storeDot, { backgroundColor: store.accentColor }]} />
                    <Text style={styles.storeTitle}>{store.label}</Text>
                  </View>
                  <View style={styles.storeActions}>
                    <TouchableOpacity
                      style={[styles.storeActionButton, styles.secondaryActionButton]}
                      onPress={() => handleOpenStore(store.key)}
                      activeOpacity={0.8}
                    >
                      <Ionicons name="open-outline" size={16} color={colors.text} />
                      <Text style={styles.secondaryActionText}>Open</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.storeActionButton, { backgroundColor: store.accentColor }]}
                      onPress={() => handleAddToList(store.key)}
                      activeOpacity={0.85}
                    >
                      <Ionicons name="add" size={16} color="#fff" />
                      <Text style={styles.primaryActionText}>Add</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <Text style={styles.resultTitle} numberOfLines={2}>
                  {title || `Browsing ${store.label} search results`}
                </Text>

                <Text style={styles.resultUrl} numberOfLines={1}>
                  {currentUrl}
                </Text>

                <View style={styles.webViewShell}>
                  <WebView
                    ref={ref => {
                      webViewRefs.current[store.key] = ref;
                    }}
                    source={{ uri: webViewUrls[store.key] }}
                    style={styles.webView}
                    onLoadStart={() => handleWebViewLoadStart(store.key)}
                    onLoadEnd={() => handleWebViewLoadEnd(store.key)}
                    onNavigationStateChange={navState => handleNavigationStateChange(store.key, navState.url)}
                    onMessage={event => handleWebViewMessage(store.key, event.nativeEvent.data)}
                    javaScriptEnabled
                    domStorageEnabled
                    userAgent="Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1"
                  />

                  {isLoading && (
                    <View style={styles.loadingOverlay}>
                      <ActivityIndicator size="large" color={store.accentColor} />
                      <Text style={styles.loadingText}>Loading {store.label}...</Text>
                    </View>
                  )}
                </View>
              </View>
            );
          })}
        </ScrollView>

        <Animated.View style={[styles.toast, { opacity: toastOpacity }]} pointerEvents="none">
          <Ionicons name="checkmark-circle" size={18} color="#fff" />
          <Text style={styles.toastText}>{toastMessage}</Text>
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: PRIMARY_GREEN,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: PRIMARY_GREEN,
  },
  headerIconBtn: {
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
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 8,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
  },
  searchButton: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  searchButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.card,
  },
  summaryBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: 16,
    marginBottom: 8,
    backgroundColor: 'rgba(0,0,0,0.12)',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  summaryBannerText: {
    flex: 1,
    color: colors.card,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  },
  contentArea: {
    flex: 1,
    backgroundColor: '#F6F8F4',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 120,
    gap: 16,
  },
  storeCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  storeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 10,
  },
  storeTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexShrink: 1,
  },
  storeDot: {
    width: 10,
    height: 10,
    borderRadius: 999,
  },
  storeTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },
  storeActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  storeActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  secondaryActionButton: {
    backgroundColor: '#EEF2EC',
  },
  secondaryActionText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
  },
  primaryActionText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#fff',
  },
  resultTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  resultUrl: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  webViewShell: {
    height: 280,
    overflow: 'hidden',
    borderRadius: 16,
    backgroundColor: '#F2F5F0',
  },
  webView: {
    flex: 1,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.92)',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  toast: {
    position: 'absolute',
    bottom: 24,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(30,30,30,0.88)',
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  toastText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
});
