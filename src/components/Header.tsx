import React from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

interface HeaderProps {
  title: string;
}

export const Header: React.FC<HeaderProps> = ({ title }) => {
  const navigation = useNavigation();

  const openDrawer = () => {
    // getParent() should be the Drawer navigator
    // @ts-ignore - runtime check
    navigation?.getParent?.()?.openDrawer?.();
  };

  return (
    <View style={styles.container}>
      {Platform.OS === 'android' && (
        <TouchableOpacity style={styles.leftButton} onPress={openDrawer} accessibilityLabel="Abrir menu">
          <MaterialIcons name="menu" size={26} color="#FFFFFF" />
        </TouchableOpacity>
      )}

      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#18181B',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#27272A',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  leftButton: {
    position: 'absolute',
    left: 16,
    top: 16,
    padding: 8,
  },
});