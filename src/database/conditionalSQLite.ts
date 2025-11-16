/**
 * Conditional SQLite Import
 * Só importa SQLite se não for web
 */

import { Platform } from 'react-native';

let db: any = null;

// Função para inicializar o banco de forma condicional
export const initializeSQLite = async () => {
  if (Platform.OS === 'web') {
    console.log('🌐 Web detectado, pulando SQLite');
    return null;
  }

  try {
    const SQLite = require('expo-sqlite');
    db = SQLite.openDatabaseSync('saborDaVila.db');
    console.log('✅ Banco SQLite inicializado');
    return db;
  } catch (error) {
    console.error('❌ Erro ao inicializar SQLite:', error);
    return null;
  }
};

export const getDatabase = () => {
  if (Platform.OS === 'web') {
    return null;
  }
  return db;
};

export { db };