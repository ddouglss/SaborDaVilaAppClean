import { Platform } from 'react-native';
import { DailySales, SalesSummary } from '../types/sales';

// Só importa SQLite se não for web
let db: any = null;

if (Platform.OS !== 'web') {
  try {
    const SQLite = require('expo-sqlite');
    db = SQLite.openDatabaseSync('saborDaVila.db');
  } catch (error) {
    console.error('❌ Erro ao inicializar SQLite:', error);
  }
}

export async function initializeSalesTable() {
  if (Platform.OS === 'web') {
    console.log('🌐 Web: Pulando inicialização da tabela sales');
    return;
  }

  if (!db) {
    console.log('⚠️ Banco SQLite não disponível');
    return;
  }

  try {
    // Esta função agora apenas verifica se a tabela existe
    // A criação real acontece em database.ts com a estrutura correta
    const tableExists = db.getAllSync(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name='sales'
    `);
    
    if (tableExists.length === 0) {
      console.log('⚠️ Tabela sales não existe, será criada pela migração principal');
    } else {
      console.log('✅ Tabela sales verificada');
    }
  } catch (error) {
    console.error('❌ Erro ao verificar tabela sales:', error);
  }
}


// 🔹 Inserir nova venda
export async function insertSale(product: string, itemsSold: number, total: number, shopId: string) {
  await db.runAsync(
    'INSERT INTO sales (product, itemsSold, total, shopId) VALUES (?, ?, ?, ?);',
    [product, itemsSold, total, shopId]
  );
}

// 🔹 Buscar todas as vendas recentes (últimas 20)
export async function getRecentSales(shopId: string): Promise<any[]> {
  const result = await db.getAllAsync<any>(
    'SELECT * FROM sales WHERE shopId = ? ORDER BY id DESC LIMIT 20;',
    [shopId]
  );
  return result || [];
}

// 🔹 Atualizar venda existente
export async function updateSale(id: number, product: string, itemsSold: number, total: number) {
  await db.runAsync(
    'UPDATE sales SET product = ?, itemsSold = ?, total = ? WHERE id = ?;',
    [product, itemsSold, total, id]
  );
}

// 🔹 Excluir venda
export async function deleteSale(id: number) {
  await db.runAsync('DELETE FROM sales WHERE id = ?;', [id]);
}

// 🔹 Total de vendas do dia
export async function getDailySales(shopId: string): Promise<DailySales> {
  if (Platform.OS === 'web') {
    console.log('🌐 Web: Retornando vendas do dia mock');
    return { total: 0, items: 0 };
  }

  if (!db) {
    return { total: 0, items: 0 };
  }

  try {
    // Primeiro tentar com shopId
    try {
      const result = await db.getFirstAsync<DailySales>(`
        SELECT 
          COALESCE(SUM(total), 0) AS total,
          COALESCE(SUM(itemsSold), 0) AS items
        FROM sales
        WHERE shopId = ? AND date(date) = date('now');
      `, [shopId]);
      return result || { total: 0, items: 0 };
    } catch (shopIdError) {
      // Se falhar com shopId, tentar sem (fallback para tabelas antigas)
      console.log('⚠️ shopId não encontrado, usando fallback para vendas do dia');
      try {
        const result = await db.getFirstAsync<DailySales>(`
          SELECT 
            COALESCE(SUM(total), 0) AS total,
            COALESCE(SUM(itemsSold), 0) AS items
          FROM sales
          WHERE date(date) = date('now');
        `);
        return result || { total: 0, items: 0 };
      } catch (fallbackError) {
        console.log('⚠️ Erro também no fallback, retornando zero');
        return { total: 0, items: 0 };
      }
    }
  } catch (error) {
    console.error('❌ Erro ao calcular vendas do dia:', error);
    return { total: 0, items: 0 };
  }
}

// 🔹 Resumo semanal
export async function getWeeklySummary(shopId: string): Promise<SalesSummary> {
  if (Platform.OS === 'web') {
    console.log('🌐 Web: Retornando resumo semanal mock');
    return { total: 150.50, items: 12, avgTicket: 12.54 };
  }

  if (!db) {
    return { total: 0, items: 0, avgTicket: 0 };
  }

  try {
    // Primeiro tentar com shopId
    try {
      const result = await db.getFirstAsync<SalesSummary>(`
        SELECT 
          COALESCE(SUM(total), 0) AS total,
          COALESCE(SUM(itemsSold), 0) AS items,
          CASE WHEN SUM(itemsSold) > 0 THEN SUM(total) / SUM(itemsSold) ELSE 0 END AS avgTicket
        FROM sales
        WHERE shopId = ? AND date(date) >= date('now', '-7 days');
      `, [shopId]);
      return result || { total: 0, items: 0, avgTicket: 0 };
    } catch (shopIdError) {
      // Se falhar com shopId, tentar sem (fallback para tabelas antigas)
      console.log('⚠️ shopId não encontrado, usando fallback para resumo semanal');
      try {
        const result = await db.getFirstAsync<SalesSummary>(`
          SELECT 
            COALESCE(SUM(total), 0) AS total,
            COALESCE(SUM(itemsSold), 0) AS items,
            CASE WHEN SUM(itemsSold) > 0 THEN SUM(total) / SUM(itemsSold) ELSE 0 END AS avgTicket
          FROM sales
          WHERE date(date) >= date('now', '-7 days');
        `);
        return result || { total: 0, items: 0, avgTicket: 0 };
      } catch (fallbackError) {
        console.log('⚠️ Erro também no fallback, retornando zero');
        return { total: 0, items: 0, avgTicket: 0 };
      }
    }
  } catch (error) {
    console.error('❌ Erro ao gerar resumo semanal:', error);
    return { total: 0, items: 0, avgTicket: 0 };
  }
}
