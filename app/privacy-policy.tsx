import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Stack, router } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { BodyScrollView } from '@/components/BodyScrollView';
import { IconSymbol } from '@/components/IconSymbol';

const BG_COLOR = '#51B336';

export default function PrivacyPolicyScreen() {
  const handleBack = () => {
    console.log('Privacy Policy: back button pressed');
    router.back();
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Privacy Policy',
          headerStyle: { backgroundColor: BG_COLOR },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: '700', color: '#fff' },
          headerLeft: () => (
            <TouchableOpacity onPress={handleBack} style={styles.backButton} activeOpacity={0.7}>
              <IconSymbol
                ios_icon_name="chevron.left"
                android_material_icon_name="arrow-back"
                size={22}
                color="#fff"
              />
            </TouchableOpacity>
          ),
        }}
      />
      <BodyScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.pageTitle}>Privacy Policy</Text>
        <Text style={styles.effectiveDate}>Effective Date: 3/20/26</Text>

        <Text style={styles.intro}>
          Thank you for using our app ("the App"). Your privacy is important to us. This Privacy Policy explains our approach to user information.
        </Text>

        <View style={styles.section}>
          <Text style={styles.sectionHeader}>1. No Data Collection</Text>
          <Text style={styles.body}>
            We are committed to protecting your privacy. The App does not collect, store, process, or share any personal or non-personal information from its users.
          </Text>
          <Text style={styles.body}>This includes, but is not limited to:</Text>
          <View style={styles.bulletList}>
            <Text style={styles.bullet}>• Names, email addresses, or contact information</Text>
            <Text style={styles.bullet}>• Location data</Text>
            <Text style={styles.bullet}>• Device information</Text>
            <Text style={styles.bullet}>• Usage analytics</Text>
            <Text style={styles.bullet}>• Cookies or tracking data</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionHeader}>2. No Third-Party Tracking</Text>
          <Text style={styles.body}>
            The App does not use third-party analytics tools, advertising networks, or tracking technologies that collect user data.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionHeader}>3. No Data Sharing</Text>
          <Text style={styles.body}>
            Because we do not collect any data, we do not sell, trade, or share any user information with third parties.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionHeader}>4. Children's Privacy</Text>
          <Text style={styles.body}>
            Since the App does not collect any personal information, it is safe for users of all ages, including children under 13. We do not knowingly collect any data from children or any other users.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionHeader}>5. Security</Text>
          <Text style={styles.body}>
            Although we do not collect or store user data, we are committed to maintaining a secure and reliable application experience.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionHeader}>6. Changes to This Privacy Policy</Text>
          <Text style={styles.body}>
            We may update this Privacy Policy from time to time. Any changes will be reflected by updating the "3/20/26" at the top of this document. Continued use of the App after changes constitutes acceptance of the updated policy.
          </Text>
        </View>
      </BodyScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG_COLOR,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 48,
  },
  backButton: {
    padding: 4,
    marginLeft: 4,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 4,
  },
  effectiveDate: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.75)',
    marginBottom: 20,
  },
  intro: {
    fontSize: 15,
    color: '#fff',
    lineHeight: 23,
    marginBottom: 24,
    opacity: 0.9,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    fontSize: 17,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
  },
  body: {
    fontSize: 15,
    color: '#fff',
    lineHeight: 23,
    marginBottom: 8,
    opacity: 0.9,
  },
  bulletList: {
    marginTop: 4,
    paddingLeft: 8,
  },
  bullet: {
    fontSize: 15,
    color: '#fff',
    lineHeight: 26,
    opacity: 0.9,
  },
});
