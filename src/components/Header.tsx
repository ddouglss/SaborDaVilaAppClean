import React, { useState } from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { Menu } from 'lucide-react-native';
import { AndroidMenu } from './AndroidMenu';

interface HeaderProps {
  title: string;
}

export const Header: React.FC<HeaderProps> = ({ title }) => {
  const [menuVisible, setMenuVisible] = useState(false);

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const closeMenu = () => {
    setMenuVisible(false);
  };

  return (
    <>
      <View style={styles.container}>
        {Platform.OS === 'android' && (
          <TouchableOpacity 
            style={styles.leftButton} 
            onPress={toggleMenu} 
            accessibilityLabel="Abrir menu"
            accessibilityHint="Toque para abrir o menu lateral"
          >
            <Menu size={26} color="#FFFFFF" />
          </TouchableOpacity>
        )}

        <Text style={styles.title}>{title}</Text>
      </View>

      {/* Menu Modal para Android */}
      {Platform.OS === 'android' && (
        <AndroidMenu visible={menuVisible} onClose={closeMenu} />
      )}
    </>
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