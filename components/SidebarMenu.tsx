
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Animated,
  Dimensions,
  ScrollView,
  Pressable,
} from 'react-native';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';

const { width } = Dimensions.get('window');
const SIDEBAR_WIDTH = width * 0.8;

interface SidebarMenuProps {
  visible: boolean;
  onClose: () => void;
}

export default function SidebarMenu({ visible, onClose }: SidebarMenuProps) {
  const slideAnim = React.useRef(new Animated.Value(SIDEBAR_WIDTH)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 11,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: SIDEBAR_WIDTH,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, slideAnim]);

  const handleMenuItemPress = (item: string) => {
    console.log('Menu item pressed:', item);
    // TODO: Add navigation logic for each menu item
    onClose();
  };

  const dealText = '🎉 Special Deal: 20% off all produce this week!';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        {/* Backdrop */}
        <Pressable style={styles.backdrop} onPress={onClose} />

        {/* Sidebar */}
        <Animated.View
          style={[
            styles.sidebar,
            {
              transform: [{ translateX: slideAnim }],
            },
          ]}
        >
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Close Button */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <IconSymbol
                ios_icon_name="xmark"
                android_material_icon_name="close"
                size={24}
                color={colors.text}
              />
            </TouchableOpacity>

            {/* Deal Section - Largest */}
            <View style={styles.dealSection}>
              <View style={styles.dealIconContainer}>
                <IconSymbol
                  ios_icon_name="tag.fill"
                  android_material_icon_name="local-offer"
                  size={32}
                  color={colors.card}
                />
              </View>
              <Text style={styles.dealText}>{dealText}</Text>
            </View>

            {/* Menu Items */}
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleMenuItemPress('Search Items')}
              activeOpacity={0.7}
            >
              <IconSymbol
                ios_icon_name="magnifyingglass"
                android_material_icon_name="search"
                size={24}
                color={colors.text}
              />
              <Text style={styles.menuItemText}>Search Items</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleMenuItemPress('Compare')}
              activeOpacity={0.7}
            >
              <IconSymbol
                ios_icon_name="chart.bar.fill"
                android_material_icon_name="compare"
                size={24}
                color={colors.text}
              />
              <Text style={styles.menuItemText}>Compare</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleMenuItemPress('Recent Purchases')}
              activeOpacity={0.7}
            >
              <IconSymbol
                ios_icon_name="clock.fill"
                android_material_icon_name="history"
                size={24}
                color={colors.text}
              />
              <Text style={styles.menuItemText}>Recent Purchases</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleMenuItemPress('Current Deals')}
              activeOpacity={0.7}
            >
              <IconSymbol
                ios_icon_name="tag.fill"
                android_material_icon_name="local-offer"
                size={24}
                color={colors.text}
              />
              <Text style={styles.menuItemText}>Current Deals</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleMenuItemPress('Plans')}
              activeOpacity={0.7}
            >
              <IconSymbol
                ios_icon_name="list.bullet"
                android_material_icon_name="assignment"
                size={24}
                color={colors.text}
              />
              <Text style={styles.menuItemText}>Plans</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleMenuItemPress('Help')}
              activeOpacity={0.7}
            >
              <IconSymbol
                ios_icon_name="questionmark.circle.fill"
                android_material_icon_name="help"
                size={24}
                color={colors.text}
              />
              <Text style={styles.menuItemText}>Help</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleMenuItemPress('About Us')}
              activeOpacity={0.7}
            >
              <IconSymbol
                ios_icon_name="info.circle.fill"
                android_material_icon_name="info"
                size={24}
                color={colors.text}
              />
              <Text style={styles.menuItemText}>About Us</Text>
            </TouchableOpacity>

            {/* Footer */}
            <View style={styles.footer}>
              <TouchableOpacity
                onPress={() => handleMenuItemPress('Privacy Policy')}
                activeOpacity={0.7}
              >
                <Text style={styles.footerText}>Privacy Policy</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  sidebar: {
    width: SIDEBAR_WIDTH,
    backgroundColor: colors.card,
    height: '100%',
    boxShadow: '-4px 0px 12px rgba(0, 0, 0, 0.2)',
    elevation: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 48,
    paddingBottom: 32,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
    padding: 8,
    backgroundColor: colors.backgroundAlt,
    borderRadius: 20,
  },
  dealSection: {
    backgroundColor: colors.primary,
    marginHorizontal: 16,
    marginBottom: 24,
    padding: 24,
    borderRadius: 12,
    minHeight: 140,
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
    elevation: 5,
  },
  dealIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  dealText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.card,
    textAlign: 'center',
    lineHeight: 26,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginHorizontal: 16,
    marginBottom: 8,
    backgroundColor: colors.backgroundAlt,
    borderRadius: 8,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 16,
  },
  footer: {
    marginTop: 32,
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginHorizontal: 16,
    backgroundColor: colors.grey + '20',
    borderRadius: 8,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    textDecorationLine: 'underline',
  },
});
