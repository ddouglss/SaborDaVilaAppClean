/**
 * Database Repository Wrapper
 * Wrapper que escolhe entre SQLite real ou mock para web
 */

import { isWebPlatform, mockSales, mockProducts } from '../utils/platformUtils';

export const withPlatformDatabase = <T extends any[], R>(
  sqliteFunction: (...args: T) => Promise<R>,
  webFallback: (...args: T) => Promise<R>
) => {
  return async (...args: T): Promise<R> => {
    if (isWebPlatform()) {
      return webFallback(...args);
    }
    return sqliteFunction(...args);
  };
};

// Funções mock para web
export const mockSalesRepository = {
  async getAllSales(lojaId: string) {
    console.log('🌐 Mock: Carregando vendas para web');
    return mockSales.filter(sale => sale.lojaId.toString() === lojaId);
  },

  async initializeSalesTable() {
    console.log('🌐 Mock: Inicializando tabela de vendas para web');
  },

  async insertSale(sale: any) {
    console.log('🌐 Mock: Inserindo venda para web', sale);
    return { insertId: Date.now() };
  }
};

export const mockProductRepository = {
  async getAllProducts(lojaId: string) {
    console.log('🌐 Mock: Carregando produtos para web');
    return mockProducts.filter(product => product.lojaId.toString() === lojaId);
  },

  async initializeProductsTable() {
    console.log('🌐 Mock: Inicializando tabela de produtos para web');
  },

  async insertProduct(product: any) {
    console.log('🌐 Mock: Inserindo produto para web', product);
    return { insertId: Date.now() };
  }
};

export const mockAuthRepository = {
  async getAllUsers() {
    console.log('🌐 Mock: Carregando usuários para web');
    return [];
  },

  async initializeUsersTable() {
    console.log('🌐 Mock: Inicializando tabela de usuários para web');
  }
};