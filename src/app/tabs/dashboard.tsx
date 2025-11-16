/**
 * DashboardScreen - Dashboard completo para mobile, simplificado para web
 */
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Alert,
  Dimensions,
  Platform,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useDashboard } from '../../hooks/useDashboard';
import { DashboardCard } from '../../components/DashboardCard';
import { Header } from '../../components/Header';
import {
  SalesLineChart,
  TopProductsBarChart,
  DashboardChart,
} from '../../components/DashboardChart';
import { Button } from '../../components/Button';
import { seedDatabase } from '../../database/seedData';
import { Settings, DollarSign, Calendar, BarChart2, Target, Package, Warehouse, TrendingUp, AlertTriangle, CheckCircle, RefreshCw, Database } from 'lucide-react-native';

/**
 * Hook para obter dimensões da tela
 */
const { width: screenWidth } = Dimensions.get('window');

// Componente web inline
const WebDashboard = () => {
  const { isAdmin } = useAuth();

  return (
    <View style={webStyles.container}>
      <View style={webStyles.header}>
        <Text style={webStyles.title}>🌐 Dashboard Web</Text>
        <Text style={webStyles.subtitle}>
          {isAdmin ? 'Modo Administrador' : 'Loja Demo'}
        </Text>
      </View>
      
      <View style={webStyles.content}>
        <View style={webStyles.card}>
          <Text style={webStyles.cardTitle}>Vendas Hoje</Text>
          <Text style={webStyles.cardValue}>
            {isAdmin ? 'R$ 1.250,00' : 'R$ 0,00'}
          </Text>
          <Text style={webStyles.cardSubtitle}>
            {isAdmin ? '8 vendas • 25 itens' : '0 vendas • 0 itens'}
          </Text>
        </View>

        <View style={webStyles.card}>
          <Text style={webStyles.cardTitle}>Vendas Semana</Text>
          <Text style={webStyles.cardValue}>
            {isAdmin ? 'R$ 8.750,50' : 'R$ 150,50'}
          </Text>
          <Text style={webStyles.cardSubtitle}>
            {isAdmin ? '45 vendas • 120 itens' : '5 vendas • 12 itens'}
          </Text>
        </View>

        <View style={webStyles.card}>
          <Text style={webStyles.cardTitle}>Vendas Mês</Text>
          <Text style={webStyles.cardValue}>
            {isAdmin ? 'R$ 35.850,75' : 'R$ 850,75'}
          </Text>
          <Text style={webStyles.cardSubtitle}>
            {isAdmin ? '180 vendas • 450 itens' : '25 vendas • 60 itens'}
          </Text>
        </View>

        <View style={webStyles.card}>
          <Text style={webStyles.cardTitle}>Ticket Médio</Text>
          <Text style={webStyles.cardValue}>
            {isAdmin ? 'R$ 156,25' : 'R$ 34,03'}
          </Text>
          <Text style={webStyles.cardSubtitle}>Últimos 30 dias</Text>
        </View>
      </View>

      <View style={webStyles.footer}>
        <Text style={webStyles.footerText}>
          {isAdmin 
            ? '🔧 Dados reais do sistema - Acesso administrativo' 
            : '📱 Para funcionalidades completas, use o app mobile'
          }
        </Text>
      </View>
    </View>
  );
};

// Componente mobile completo
const MobileDashboard = () => {
  const { activeShop, isAdmin } = useAuth();
  const {
    data: dashboardData,
    isLoading,
    error,
    lastUpdated,
    refresh,
  } = useDashboard(activeShop?.id);

  console.log(`📊 Dashboard: Renderizando tela - Loja ${activeShop?.id}`);

  /**
   * Função para formatar data da última atualização
   */
  const formatLastUpdated = (date: Date | null): string => {
    if (!date) return '';
    return `Última atualização: ${date.toLocaleTimeString('pt-BR')}`;
  };

  /**
   * Função para lidar com refresh manual
   */
  const handleRefresh = async () => {
    console.log('🔄 Dashboard: Refresh manual solicitado');
    try {
      await refresh();
    } catch (error) {
      console.error('❌ Dashboard: Erro no refresh:', error);
      Alert.alert('Erro', 'Não foi possível atualizar os dados');
    }
  };

  /**
   * Função para popular dados de exemplo
   */
  const handleSeedData = async () => {
    if (!activeShop?.id) {
      Alert.alert('Erro', 'Nenhuma loja ativa selecionada');
      return;
    }

    Alert.alert(
      'Dados de Exemplo',
      'Deseja adicionar dados de exemplo para demonstração dos KPIs?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Adicionar',
          onPress: async () => {
            try {
              console.log('🌱 Dashboard: Populando dados de exemplo');
              await seedDatabase(activeShop.id);
              await refresh(); // Recarregar dados após popular
              Alert.alert('Sucesso', 'Dados de exemplo adicionados com sucesso!');
            } catch (error) {
              console.error('❌ Dashboard: Erro ao popular dados:', error);
              Alert.alert('Erro', 'Não foi possível adicionar dados de exemplo');
            }
          }
        }
      ]
    );
  };

  // Estados condicionais
  if (!activeShop) {
    return (
      <View style={mobileStyles.container}>
        <View style={mobileStyles.header}>
          <View style={mobileStyles.titleContainer}>
            <Settings color="#FFFFFF" size={28} style={mobileStyles.titleIcon} />
            <Text style={mobileStyles.title}>Dashboard</Text>
          </View>
        </View>

        <View style={mobileStyles.noShopContainer}>
          <Text style={mobileStyles.noShopText}>
            Selecione uma loja para visualizar o dashboard
          </Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={mobileStyles.container}>
        <View style={mobileStyles.header}>
          <Text style={mobileStyles.title}>📊 Dashboard</Text>
          {activeShop && (
            <Text style={mobileStyles.shopName}>{activeShop.nomeDaLoja}</Text>
          )}
        </View>

        <View style={mobileStyles.errorContainer}>
          <Text style={mobileStyles.errorText}>{error}</Text>
          <Button
            title="Tentar Novamente"
            onPress={handleRefresh}
          />
        </View>
      </View>
    );
  }

  if (isLoading && !dashboardData) {
    return (
      <ScrollView style={mobileStyles.container}>
        <View style={mobileStyles.header}>
          <View style={mobileStyles.titleContainer}>
            <Settings color="#FFFFFF" size={28} style={mobileStyles.titleIcon} />
            <Text style={mobileStyles.title}>Dashboard</Text>
          </View>
          {activeShop && (
            <Text style={mobileStyles.shopName}>{activeShop.nomeDaLoja}</Text>
          )}
        </View>

        {/* Cards de loading */}
        <View style={mobileStyles.kpiGrid}>
          {[1, 2, 3, 4].map((index) => (
            <View key={index} style={mobileStyles.kpiCard}>
              <DashboardCard
                title="Carregando..."
                value="..."
                isLoading={true}
                variant="compact"
              />
            </View>
          ))}
        </View>

        <View style={mobileStyles.chartSection}>
          <View style={mobileStyles.sectionTitleContainer}>
            <TrendingUp color="#FFFFFF" size={20} style={mobileStyles.sectionIcon} />
            <Text style={mobileStyles.sectionTitle}>Gráficos</Text>
          </View>
          <DashboardChart
            type="line"
            title="Vendas dos Últimos Dias"
            data={[]}
            isLoading={true}
          />
          <DashboardChart
            type="bar"
            title="Produtos Mais Vendidos"
            data={[]}
            isLoading={true}
          />
        </View>
      </ScrollView>
    );
  }

  // Renderizar conteúdo principal
  if (!dashboardData) {
    return null;
  }

  const { daily, weekly, monthly, averageTicket, stockMetrics, topProducts, salesLast30Days } = dashboardData;

  return (
    <View style={mobileStyles.wrapper}>
      <Header title="Dashboard" />
      <ScrollView
        style={mobileStyles.container}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={handleRefresh}
            colors={['#007AFF']}
            tintColor="#007AFF"
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Shop info and seed data */}
        <View style={mobileStyles.contentHeader}>
          {activeShop && (
            <Text style={mobileStyles.shopName}>{activeShop.nomeDaLoja}</Text>
          )}
          {lastUpdated && (
            <Text style={mobileStyles.lastUpdated}>
              {formatLastUpdated(lastUpdated)}
            </Text>
          )}
          
          {/* Botão para adicionar dados de exemplo apenas para admins */}
          {isAdmin && (
            <View style={mobileStyles.seedDataContainer}>
              <Button
                title="Adicionar Dados de Exemplo"
                onPress={handleSeedData}
                variant="secondary"
                icon={<Database color="#6366F1" size={16} />}
              />
            </View>
          )}
        </View>

        {/* KPI Cards Grid */}
        <View style={mobileStyles.kpiGrid}>
          <View style={mobileStyles.kpiCard}>
            <DashboardCard
              title="Vendas Hoje"
              value={daily.totalSales}
              subtitle={`${daily.salesCount} vendas • ${daily.itemsSold} itens`}
              variant="highlighted"
              icon={<DollarSign color="#6366F1" size={20} />}
            />
          </View>

          <View style={mobileStyles.kpiCard}>
            <DashboardCard
              title="Vendas Semana"
              value={weekly.totalSales}
              subtitle={`${weekly.salesCount} vendas • ${weekly.itemsSold} itens`}
              icon={<Calendar color="#6366F1" size={20} />}
            />
          </View>

          <View style={mobileStyles.kpiCard}>
            <DashboardCard
              title="Vendas Mês"
              value={monthly.totalSales}
              subtitle={`${monthly.salesCount} vendas • ${monthly.itemsSold} itens`}
              icon={<BarChart2 color="#6366F1" size={20} />}
            />
          </View>

          <View style={mobileStyles.kpiCard}>
            <DashboardCard
              title="Ticket Médio"
              value={averageTicket}
              subtitle="Últimos 30 dias"
              icon={<Target color="#6366F1" size={20} />}
            />
          </View>
        </View>

        {/* Stock Metrics */}
        <View style={mobileStyles.section}>
          <View style={mobileStyles.sectionTitleContainer}>
            <Package color="#FFFFFF" size={20} style={mobileStyles.sectionIcon} />
            <Text style={mobileStyles.sectionTitle}>Estoque</Text>
          </View>
          
          <View style={mobileStyles.stockGrid}>
            <View style={mobileStyles.stockCard}>
              <DashboardCard
                title="Produtos"
                value={stockMetrics.totalProducts}
                variant="compact"
                icon={<Package color="#6366F1" size={16} />}
              />
            </View>

            <View style={mobileStyles.stockCard}>
              <DashboardCard
                title="Itens em Estoque"
                value={stockMetrics.totalStockItems}
                variant="compact"
                icon={<Warehouse color="#6366F1" size={16} />}
              />
            </View>

            <View style={mobileStyles.stockCard}>
              <DashboardCard
                title="Valor do Estoque"
                value={stockMetrics.totalStockValue}
                variant="compact"
                icon={<DollarSign color="#6366F1" size={16} />}
              />
            </View>

            <View style={mobileStyles.stockCard}>
              <DashboardCard
                title="Estoque Baixo"
                value={stockMetrics.lowStockCount}
                subtitle={`${stockMetrics.lowStockProducts.length} produtos`}
                variant="compact"
                color={stockMetrics.lowStockCount > 0 ? '#EF4444' : '#22C55E'}
                icon={stockMetrics.lowStockCount > 0 ? <AlertTriangle color="#EF4444" size={16} /> : <CheckCircle color="#22C55E" size={16} />}
              />
            </View>
          </View>
        </View>

        {/* Charts Section */}
        <View style={mobileStyles.chartSection}>
          <View style={mobileStyles.sectionTitleContainer}>
            <TrendingUp color="#FFFFFF" size={20} style={mobileStyles.sectionIcon} />
            <Text style={mobileStyles.sectionTitle}>Gráficos</Text>
          </View>
          
          {/* Sales Trend Chart */}
          <SalesLineChart
            data={salesLast30Days}
            title="Tendência de Vendas (Últimos 7 dias)"
          />

          {/* Top Products Chart */}
          {topProducts.length > 0 && (
            <TopProductsBarChart
              data={topProducts}
              title="Top 5 Produtos Mais Vendidos"
            />
          )}
        </View>

        {/* Actions Section (apenas para admin) */}
        {isAdmin && (
          <View style={mobileStyles.actionsSection}>
            <View style={mobileStyles.sectionTitleContainer}>
              <Settings color="#FFFFFF" size={20} style={mobileStyles.sectionIcon} />
              <Text style={mobileStyles.sectionTitle}>Ações</Text>
            </View>
            <View style={mobileStyles.refreshButton}>
              <Button
                title="Atualizar Dados"
                onPress={handleRefresh}
              />
            </View>
          </View>
        )}

        {/* Bottom padding */}
        <View style={mobileStyles.bottomPadding} />
      </ScrollView>
    </View>
  );
};

export const DashboardScreen: React.FC = () => {
  // Se for web, usar versão ultra-simplificada
  if (Platform.OS === 'web') {
    return <WebDashboard />;
  }

  // Para mobile, usar versão simples
  return <MobileDashboard />;
};

const webStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#09090B',
  },
  header: {
    backgroundColor: '#18181B',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#27272A',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#A1A1AA',
  },
  content: {
    flex: 1,
    padding: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: '#18181B',
    padding: 16,
    borderRadius: 12,
    width: '48%',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#27272A',
  },
  cardTitle: {
    fontSize: 14,
    color: '#A1A1AA',
    marginBottom: 8,
  },
  cardValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#71717A',
  },
  footer: {
    padding: 20,
    backgroundColor: '#18181B',
    borderTopWidth: 1,
    borderTopColor: '#27272A',
  },
  footerText: {
    color: '#A1A1AA',
    textAlign: 'center',
    fontSize: 14,
  },
});

const mobileStyles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#09090B',
  },
  container: {
    flex: 1,
    backgroundColor: '#09090B',
  },
  header: {
    backgroundColor: '#18181B',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#27272A',
  },
  contentHeader: {
    backgroundColor: '#18181B',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#27272A',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  titleIcon: {
    marginRight: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  shopName: {
    fontSize: 16,
    color: '#A1A1AA',
    marginBottom: 4,
  },
  lastUpdated: {
    fontSize: 12,
    color: '#71717A',
  },
  seedDataContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#27272A',
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    justifyContent: 'space-between',
  },
  kpiCard: {
    width: (screenWidth - 48) / 2, // 2 colunas com padding
    marginBottom: 8,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionIcon: {
    marginRight: 8,
  },
  stockGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  stockCard: {
    width: (screenWidth - 48) / 2,
    marginBottom: 8,
  },
  chartSection: {
    marginBottom: 20,
  },
  actionsSection: {
    marginBottom: 20,
  },
  refreshButton: {
    marginHorizontal: 16,
  },
  bottomPadding: {
    height: 100,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    minWidth: 150,
  },
  noShopContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noShopText: {
    fontSize: 16,
    color: '#A1A1AA',
    textAlign: 'center',
  },
  subtitle: {
    color: '#A1A1AA',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default DashboardScreen;