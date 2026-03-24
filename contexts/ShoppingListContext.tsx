import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@shopping_list_items';

export interface ShoppingListItem {
  id: string;
  name: string;
  store: string;
  url: string;
  addedAt: string;
}

interface ShoppingListContextValue {
  items: ShoppingListItem[];
  addItem: (item: ShoppingListItem) => void;
  removeItem: (id: string) => void;
  clearList: () => void;
}

const ShoppingListContext = createContext<ShoppingListContextValue | null>(null);

export function ShoppingListProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ShoppingListItem[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        console.log('[ShoppingList] Loading items from AsyncStorage');
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored) as ShoppingListItem[];
          setItems(parsed);
          console.log('[ShoppingList] Loaded', parsed.length, 'items from storage');
        }
      } catch (e) {
        console.error('[ShoppingList] Failed to load from storage:', e);
      }
    };
    load();
  }, []);

  const persist = useCallback(async (nextItems: ShoppingListItem[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(nextItems));
      console.log('[ShoppingList] Persisted', nextItems.length, 'items to storage');
    } catch (e) {
      console.error('[ShoppingList] Failed to persist to storage:', e);
    }
  }, []);

  const addItem = useCallback((item: ShoppingListItem) => {
    console.log('[ShoppingList] Adding item:', item.name, 'from', item.store);
    setItems(prev => {
      const next = [item, ...prev];
      persist(next);
      return next;
    });
  }, [persist]);

  const removeItem = useCallback((id: string) => {
    console.log('[ShoppingList] Removing item id:', id);
    setItems(prev => {
      const next = prev.filter(i => i.id !== id);
      persist(next);
      return next;
    });
  }, [persist]);

  const clearList = useCallback(() => {
    console.log('[ShoppingList] Clearing all items');
    setItems([]);
    persist([]);
  }, [persist]);

  return (
    <ShoppingListContext.Provider value={{ items, addItem, removeItem, clearList }}>
      {children}
    </ShoppingListContext.Provider>
  );
}

export function useShoppingList() {
  const ctx = useContext(ShoppingListContext);
  if (!ctx) throw new Error('useShoppingList must be used within ShoppingListProvider');
  return ctx;
}
