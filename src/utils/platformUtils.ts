/**
 * Platform Utils
 * Utilitários para detectar plataforma e aplicar fallbacks
 */

import { Platform } from 'react-native';

export const isWebPlatform = () => Platform.OS === 'web';

export const isMobilePlatform = () => Platform.OS === 'android' || Platform.OS === 'ios';

// Mock data para web
export const mockDashboardData = {
  daily: { totalSales: 0, salesCount: 0, itemsSold: 0 },
  weekly: { totalSales: 150.50, salesCount: 5, itemsSold: 12 },
  monthly: { totalSales: 850.75, salesCount: 25, itemsSold: 60 },
  averageTicket: 34.03,
  stockMetrics: {
    totalProducts: 5,
    totalStockItems: 50,
    totalStockValue: 2500.00,
    lowStockCount: 1,
    lowStockProducts: []
  },
  topProducts: [
    { name: 'Produto A', quantity: 10 },
    { name: 'Produto B', quantity: 8 },
    { name: 'Produto C', quantity: 6 }
  ],
  salesLast30Days: [
    { date: '2025-11-01', totalSales: 25.50 },
    { date: '2025-11-02', totalSales: 45.20 },
    { date: '2025-11-03', totalSales: 30.10 }
  ]
};

export const mockProducts = [
  { id: 1, nome: 'Pão de Açúcar', preco: 5.50, quantidade: 20, lojaId: 1 },
  { id: 2, nome: 'Refrigerante', preco: 4.20, quantidade: 15, lojaId: 1 },
  { id: 3, nome: 'Água Mineral', preco: 2.80, quantidade: 30, lojaId: 1 }
];

export const mockSales = [
  { id: 1, data: '2025-11-15', total: 25.50, lojaId: 1 },
  { id: 2, data: '2025-11-14', total: 45.20, lojaId: 1 },
  { id: 3, data: '2025-11-13', total: 30.10, lojaId: 1 }
];