
import { Platform } from 'react-native';
import { Stack } from 'expo-router';

export default function HomeLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: Platform.OS === 'ios',
          title: 'Home'
        }}
      />
      <Stack.Screen
        name="product/[id]"
        options={{
          headerShown: Platform.OS === 'ios',
          title: 'Product Details',
          presentation: 'card',
        }}
      />
    </Stack>
  );
}
