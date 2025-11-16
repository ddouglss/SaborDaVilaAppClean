import { Platform } from 'react-native';
import { Tabs, Stack } from 'expo-router';
import { Home, ShoppingCart, Archive, Settings, Building, BarChart3, Globe } from 'lucide-react-native';
import { useAuth } from '../../context/AuthContext';

// Layout de Tabs com lógica condicional para Android e iOS
export default function TabsLayout() {
  const auth = useAuth();
  const isAdmin = auth?.isAdmin ?? false;
  if (Platform.OS === 'android') {
    return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="dashboard" />
        <Stack.Screen name="sales" />
        <Stack.Screen name="inventory" />
        <Stack.Screen name="my-shops" />
        <Stack.Screen name="DebugScreen" />
      </Stack>
    );
  }

  // iOS: Use traditional tabs
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#6366F1',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: {
          backgroundColor: '#18181B',
          borderTopColor: '#27272A',
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        headerShown: false,
        headerStyle: { backgroundColor: '#18181B' },
        headerTintColor: '#fff',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => <BarChart3 color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="sales"
        options={{
          title: 'Vendas',
          tabBarIcon: ({ color, size }) => (
            <ShoppingCart color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="inventory"
        options={{
          title: 'Estoque',
          tabBarIcon: ({ color, size }) => (
            <Archive color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="my-shops"
        options={{
          title: 'Lojas',
          tabBarIcon: ({ color, size }) => (
            <Building color={color} size={size} />
          ),
        }}
      />
      
      <Tabs.Screen
        name="DebugScreen"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <Settings color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
