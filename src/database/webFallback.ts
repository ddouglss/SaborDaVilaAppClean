/**
 * Web Fallback para SQLite
 * Implementa as mesmas funcionalidades usando localStorage
 */

import { Platform } from 'react-native';

// Interface para simular SQLiteDatabase
interface WebSQLiteResult {
  rows?: { _array: any[], length: number };
  insertId?: number;
}

class WebSQLiteDatabase {
  private databaseName: string;

  constructor(databaseName: string) {
    this.databaseName = databaseName;
    // Inicializa estruturas básicas no localStorage
    this.initializeTables();
  }

  private initializeTables() {
    const tables = ['products', 'sales', 'usuarios', 'lojas'];
    tables.forEach(table => {
      if (!localStorage.getItem(`${this.databaseName}_${table}`)) {
        localStorage.setItem(`${this.databaseName}_${table}`, JSON.stringify([]));
      }
    });
  }

  async execAsync(sql: string, params: any[] = []): Promise<WebSQLiteResult> {
    console.log(`🌐 WebSQL: ${sql}`, params);
    
    // Parse básico de SQL para operações CRUD
    if (sql.includes('CREATE TABLE') || sql.includes('DROP TABLE')) {
      // Ignora comandos de estrutura
      return {};
    }

    if (sql.includes('INSERT INTO')) {
      return this.handleInsert(sql, params);
    }

    if (sql.includes('SELECT')) {
      return this.handleSelect(sql, params);
    }

    if (sql.includes('UPDATE')) {
      return this.handleUpdate(sql, params);
    }

    if (sql.includes('DELETE')) {
      return this.handleDelete(sql, params);
    }

    return {};
  }

  private handleInsert(sql: string, params: any[]): WebSQLiteResult {
    // Extrai nome da tabela
    const tableMatch = sql.match(/INSERT INTO (\w+)/);
    if (!tableMatch) return {};
    
    const tableName = tableMatch[1];
    const key = `${this.databaseName}_${tableName}`;
    const data = JSON.parse(localStorage.getItem(key) || '[]');
    
    // Gera um ID único
    const id = Date.now() + Math.random();
    
    // Cria objeto com os dados (simplificado)
    const newRecord: any = { id };
    params.forEach((param, index) => {
      newRecord[`field_${index}`] = param;
    });

    data.push(newRecord);
    localStorage.setItem(key, JSON.stringify(data));
    
    return { insertId: id };
  }

  private handleSelect(sql: string, params: any[]): WebSQLiteResult {
    // Para simplificar, retorna dados vazios
    // Em uma implementação completa, faria parsing completo do SQL
    const tableMatch = sql.match(/FROM (\w+)/);
    if (!tableMatch) return { rows: { _array: [], length: 0 } };
    
    const tableName = tableMatch[1];
    const key = `${this.databaseName}_${tableName}`;
    const data = JSON.parse(localStorage.getItem(key) || '[]');
    
    return { rows: { _array: data, length: data.length } };
  }

  private handleUpdate(sql: string, params: any[]): WebSQLiteResult {
    return {};
  }

  private handleDelete(sql: string, params: any[]): WebSQLiteResult {
    return {};
  }
}

export const createWebDatabase = (databaseName: string) => {
  if (Platform.OS === 'web') {
    return new WebSQLiteDatabase(databaseName);
  }
  return null;
};

export const isWebPlatform = () => Platform.OS === 'web';