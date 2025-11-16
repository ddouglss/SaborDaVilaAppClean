import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import {
  Home,
  BarChart3,
  ShoppingCart,
  Package,
  Globe,
  Building,
  Settings,
} from 'lucide-react-native';

interface AndroidMenuProps {
  visible: boolean;
  onClose: () => void;
}

const { width: screenWidth } = Dimensions.get('window');
const MENU_WIDTH = screenWidth * 0.75;

export const AndroidMenu: React.FC<AndroidMenuProps> = ({ visible, onClose }) => {
  const router = useRouter();
  const auth = useAuth();
  const isAdmin = auth?.isAdmin ?? false;
  const logout = auth?.logout;
  const slideAnim = React.useRef(new Animated.Value(visible ? 0 : -MENU_WIDTH)).current;

  React.useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: visible ? 0 : -MENU_WIDTH,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [visible]);

  const navigateAndClose = (route: string) => {
    router.push(route as any);
    onClose();
  };

  const menuItems = [
    { label: 'Menu', isHeader: true },
    { label: 'Home', route: '/tabs', icon: 'Home' },
    { label: 'Dashboard', route: '/tabs/dashboard', icon: 'BarChart3' },
    { label: 'Vendas', route: '/tabs/sales', icon: 'ShoppingCart' },
    { label: 'Estoque', route: '/tabs/inventory', icon: 'Package' },
    { label: 'Lojas', route: '/tabs/my-shops', icon: 'Building' },
    ...(isAdmin ? [{ label: 'Web', route: '/tabs/WebDashboard', icon: 'Globe' }] : []),
    { label: 'Configurações', route: '/tabs/DebugScreen', icon: 'Settings' },
  ];

  const getIcon = (iconName: string) => {
    const iconProps = {
      size: 22,
      color: "#C0C0C0",
    };

    switch (iconName) {
      case 'Home':
        return <Home {...iconProps} />;
      case 'BarChart3':
        return <BarChart3 {...iconProps} />;
      case 'ShoppingCart':
        return <ShoppingCart {...iconProps} />;
      case 'Package':
        return <Package {...iconProps} />;
      case 'Building':
        return <Building {...iconProps} />;
      case 'Globe':
        return <Globe {...iconProps} />;
      case 'Settings':
        return <Settings {...iconProps} />;
      default:
        return <Home {...iconProps} />;
    }
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={onClose}
    >
      {/* Overlay escuro */}
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        {/* Menu lateral deslizante */}
        <Animated.View
          style={[
            styles.menuPanel,
            {
              transform: [{ translateX: slideAnim }],
            },
          ]}
        >
          <TouchableOpacity activeOpacity={1}>
            {/* Lista de itens do menu */}
            <View style={styles.menuItems}>
              {menuItems.map((item, index) => {
                if (item.isHeader) {
                  return (
                    <View key={index} style={styles.menuHeader}>
                      <Text style={styles.menuHeaderText}>{item.label}</Text>
                    </View>
                  );
                }

                const iconName = item.icon;
                return (
                  <TouchableOpacity
                    key={item.route}
                    style={styles.menuItem}
                    onPress={() => navigateAndClose(item.route!)}
                  >
                    <View style={styles.menuItemContent}>
                      {iconName && (
                        <View style={styles.menuIcon}>
                          {getIcon(iconName)}
                        </View>
                      )}
                      <Text style={styles.menuItemText}>{item.label}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </TouchableOpacity>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flexDirection: 'row',
  },
  menuPanel: {
    width: MENU_WIDTH,
    height: '100%',
    backgroundColor: '#1A1A1A',
    paddingTop: 50,
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuItems: {
    flex: 1,
  },
  menuHeader: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#555555',
    backgroundColor: '#333333',
  },
  menuHeaderText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  menuItem: {
    paddingHorizontal: 24,
    paddingVertical: 18,
    borderBottomWidth: 0.5,
    borderBottomColor: '#404040',
    overflow: 'visible',
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    minHeight: 40,
  },
  menuIcon: {
    marginRight: 16,
    width: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuItemText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    letterSpacing: 0.5,
    textAlignVertical: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
});