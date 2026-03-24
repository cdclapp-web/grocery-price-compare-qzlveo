import React, { useRef, useState, useCallback } from 'react';
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

export default function SearchScreen() {
  const router = useRouter();
  const { addItem } = useShoppingList();

  const [query, setQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');
  const [activeStore, setActiveStore] = useState<StoreKey>('walmart');
  const [isLoading, setIsLoading] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');
  const [currentTitle, setCurrentTitle] = useState('');

  const toastOpacity = useRef(new Animated.Value(0)).current;
  const webViewRef = useRef<WebViewType>(null);

  const activeStoreData = STORES.find(s => s.key === activeStore)!;
  const webViewUrl = submittedQuery
    ? activeStoreData.buildUrl(submittedQuery)
    : activeStoreData.buildUrl('grocery');

  const handleSearch = useCallback(() => {
    const trimmed = query.trim();
    console.log('[Search] Search submitted, query:', trimmed, 'store:', activeStore);
    if (trimmed) {
      setSubmittedQuery(trimmed);
    }
  }, [query, activeStore]);

  const handleStoreChange = useCallback((key: StoreKey) => {
    console.log('[Search] Store tab pressed:', key);
    setActiveStore(key);
  }, []);

  const handleClearQuery = useCallback(() => {
    console.log('[Search] Clear search pressed');
    setQuery('');
    setSubmittedQuery('');
  }, []);

  const showToast = useCallback(() => {
    Animated.sequence([
      Animated.timing(toastOpacity, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.delay(1600),
      Animated.timing(toastOpacity, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start();
  }, [toastOpacity]);

  const handleAddToList = useCallback(async () => {
    console.log('[Search] Add to Shopping List pressed, url:', currentUrl, 'title:', currentTitle);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const itemName = currentTitle || submittedQuery || 'Item from ' + activeStoreData.label;
    const itemUrl = currentUrl || webViewUrl;

    addItem({
      id: Date.now().toString(),
      name: itemName,
      store: activeStoreData.label,
      url: itemUrl,
      addedAt: new Date().toISOString(),
    });

    console.log('[Search] Item added to shopping list:', itemName);
    showToast();
  }, [currentUrl, currentTitle, submittedQuery, activeStoreData, webViewUrl, addItem, showToast]);

  const handleWebViewLoadStart = useCallback(() => {
    console.log('[Search] WebView load started');
    setIsLoading(true);
  }, []);

  const handleWebViewLoadEnd = useCallback(() => {
    console.log('[Search] WebView load finished');
    setIsLoading(false);
    // Inject JS to grab page title
    webViewRef.current?.injectJavaScript(`
      (function() {
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'title', value: document.title }));
      })();
      true;
    `);
  }, []);

  const handleWebViewMessage = useCallback((event: { nativeEvent: { data: string } }) => {
    try {
      const msg = JSON.parse(event.nativeEvent.data);
      if (msg.type === 'title') {
        console.log('[Search] WebView page title:', msg.value);
        setCurrentTitle(msg.value);
      }
    } catch {
      // ignore
    }
  }, []);

  const handleNavigationStateChange = useCallback((navState: { url: string }) => {
    console.log('[Search] WebView navigation state changed, url:', navState.url);
    setCurrentUrl(navState.url);
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
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
        <Text style={styles.headerTitle}>Search Items</Text>
        <View style={styles.headerIconBtn} />
      </View>

      {/* Search Input */}
      <View style={styles.searchRow}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={18} color={colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for groceries..."
            placeholderTextColor={colors.textSecondary}
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
            autoCapitalize="none"
            autoCorrect={false}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={handleClearQuery} activeOpacity={0.7} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons name="close-circle" size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch} activeOpacity={0.8}>
          <Text style={styles.searchButtonText}>Go</Text>
        </TouchableOpacity>
      </View>

      {/* Segmented Control */}
      <View style={styles.segmentedControl}>
        {STORES.map(store => {
          const isActive = activeStore === store.key;
          return (
            <TouchableOpacity
              key={store.key}
              style={[styles.segmentTab, isActive && { backgroundColor: store.accentColor }]}
              onPress={() => handleStoreChange(store.key)}
              activeOpacity={0.75}
            >
              <Text style={[styles.segmentTabText, isActive && styles.segmentTabTextActive]}>
                {store.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* WebView */}
      <KeyboardAvoidingView
        style={styles.webViewArea}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <WebView
          ref={webViewRef}
          source={{ uri: webViewUrl }}
          style={styles.webView}
          onLoadStart={handleWebViewLoadStart}
          onLoadEnd={handleWebViewLoadEnd}
          onNavigationStateChange={handleNavigationStateChange}
          onMessage={handleWebViewMessage}
          javaScriptEnabled
          domStorageEnabled
          userAgent="Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1"
        />

        {isLoading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={PRIMARY_GREEN} />
            <Text style={styles.loadingText}>Loading {activeStoreData.label}...</Text>
          </View>
        )}

        {/* Floating Add Button */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddToList}
          activeOpacity={0.85}
        >
          <Ionicons name="add" size={20} color="#fff" />
          <Text style={styles.addButtonText}>Add to Shopping List</Text>
        </TouchableOpacity>

        {/* Toast */}
        <Animated.View style={[styles.toast, { opacity: toastOpacity }]} pointerEvents="none">
          <Ionicons name="checkmark-circle" size={18} color="#fff" />
          <Text style={styles.toastText}>Added to Shopping List ✓</Text>
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
  segmentedControl: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 0,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 10,
    padding: 4,
    gap: 4,
  },
  segmentTab: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.75)',
  },
  segmentTabTextActive: {
    color: colors.card,
  },
  webViewArea: {
    flex: 1,
    backgroundColor: colors.card,
    marginTop: 8,
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
  addButton: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: PRIMARY_GREEN,
    borderRadius: 30,
    paddingVertical: 16,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  toast: {
    position: 'absolute',
    bottom: 90,
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
