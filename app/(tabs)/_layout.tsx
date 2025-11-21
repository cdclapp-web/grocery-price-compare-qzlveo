
import React from 'react';
import { Stack } from 'expo-router';
import { colors } from '@/styles/commonStyles';

export default function TabLayout() {
  // No tabs needed - just home screen
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'none',
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen key="home" name="(home)" />
    </Stack>
  );
}
