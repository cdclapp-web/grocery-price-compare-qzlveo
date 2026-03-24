import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  SafeAreaView,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors } from '@/styles/commonStyles';
import { useShoppingList, ShoppingListItem } from '@/contexts/ShoppingListContext';

const PRIMARY_GREEN = '#51B336';

const STORE_COLORS: Record<string, string> = {
  Walmart: colors.walmartBlue,
  "Fry's": colors.frysRed,
  Safeway: '#00897B',
};

function StoreBadge({ store }: { store: string }) {
  const badgeColor = STORE_COLORS[store] ?? colors.primary;
  return (
    <View style={[styles.storeBadge, { backgroundColor: badgeColor }]}>
      <Text style={styles.storeBadgeText}>{store}</Text>
    </View>
  );
}

function ListRow({ item, onRemove }: { item: ShoppingListItem; onRemove: (id: string) => void }) {
  const handlePress = useCallback(() => {
    console.log('[ShoppingList] Row tapped, opening url:', item.url);
    Linking.openURL(item.url).catch(err =>
      console.error('[ShoppingList] Failed to open URL:', err)
    );
  }, [item.url]);

  const handleRemove = useCallback(() => {
    console.log('[ShoppingList] Remove button pressed for item:', item.id, item.name);
    onRemove(item.id);
  }, [item.id, item.name, onRemove]);

  const dateDisplay = new Date(item.addedAt).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });

  return (
    <TouchableOpacity style={styles.row} onPress={handlePress} activeOpacity={0.7}>
      <StoreBadge store={item.store} />
      <View style={styles.rowInfo}>
        <Text style={styles.rowName} numberOfLines={2}>{item.name}</Text>
        <Text style={styles.rowDate}>{dateDisplay}</Text>
      </View>
      <TouchableOpacity
        style={styles.removeBtn}
        onPress={handleRemove}
        activeOpacity={0.7}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Ionicons name="trash-outline" size={20} color="#E53935" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

function EmptyState() {
  return (
    <View style={styles.emptyState}>
      <Ionicons name="cart-outline" size={72} color="rgba(0,0,0,0.15)" />
      <Text style={styles.emptyTitle}>Your shopping list is empty</Text>
      <Text style={styles.emptySubtitle}>Search for items to add them here</Text>
    </View>
  );
}

export default function ShoppingListScreen() {
  const router = useRouter();
  const { items, removeItem, clearList } = useShoppingList();

  const handleClearAll = useCallback(() => {
    console.log('[ShoppingList] Clear All button pressed');
    Alert.alert(
      'Clear Shopping List',
      'Are you sure you want to remove all items?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: () => {
            console.log('[ShoppingList] Confirmed clear all');
            clearList();
          },
        },
      ]
    );
  }, [clearList]);

  const handleBack = useCallback(() => {
    console.log('[ShoppingList] Back button pressed');
    router.back();
  }, [router]);

  const renderItem = useCallback(
    ({ item }: { item: ShoppingListItem }) => (
      <ListRow item={item} onRemove={removeItem} />
    ),
    [removeItem]
  );

  const keyExtractor = useCallback((item: ShoppingListItem) => item.id, []);

  const itemCountText = items.length === 1 ? '1 item' : `${items.length} items`;

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerIconBtn}
          onPress={handleBack}
          activeOpacity={0.7}
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={22} color={colors.card} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Shopping List</Text>

        <TouchableOpacity
          style={styles.clearAllBtn}
          onPress={handleClearAll}
          activeOpacity={0.7}
          disabled={items.length === 0}
        >
          <Text style={[styles.clearAllText, items.length === 0 && styles.clearAllDisabled]}>
            Clear All
          </Text>
        </TouchableOpacity>
      </View>

      {/* List area */}
      <View style={styles.listArea}>
        {items.length > 0 && (
          <Text style={styles.itemCount}>{itemCountText}</Text>
        )}
        <FlatList
          data={items}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          contentContainerStyle={items.length === 0 ? styles.emptyContainer : styles.listContent}
          ListEmptyComponent={EmptyState}
          showsVerticalScrollIndicator={false}
        />
      </View>
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
  clearAllBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  clearAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.card,
  },
  clearAllDisabled: {
    opacity: 0.4,
  },
  listArea: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  itemCount: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 32,
  },
  emptyContainer: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 2,
    gap: 12,
  },
  storeBadge: {
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    minWidth: 64,
    alignItems: 'center',
  },
  storeBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
  },
  rowInfo: {
    flex: 1,
  },
  rowName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    lineHeight: 20,
  },
  rowDate: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 3,
  },
  removeBtn: {
    padding: 4,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingVertical: 80,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginTop: 20,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 22,
  },
});
