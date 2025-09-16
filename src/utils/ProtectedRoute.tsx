import React from 'react';
import { Text, View } from 'react-native';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  // Block direct URL access completely
  if (typeof window !== 'undefined' && window.location.pathname !== '/') {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#25292e' }}>
        <Text style={{ color: 'white', fontSize: 18, marginBottom: 20 }}>Direct URL access is disabled</Text>
        <Text 
          style={{ color: '#4CAF50', fontSize: 16, textDecorationLine: 'underline' }}
          onPress={() => window.location.href = '/'}
        >
          Go to Index
        </Text>
      </View>
    );
  }

  return <>{children}</>;
}