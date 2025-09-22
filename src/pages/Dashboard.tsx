import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useRestaurant } from '@/hooks/useRestaurant';
import { useDashboard } from '@/hooks/useDashboard';
import { Button } from '@/components/ui/button';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { DashboardCharts } from '@/components/dashboard/DashboardCharts';
import { ReportsSection } from '@/components/dashboard/ReportsSection';
import { Loader2, LogOut, ChefHat, ArrowLeft, RefreshCw } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, signOut, loading } = useAuth();
  const { currentRestaurant, userRole } = useRestaurant();
  const { dashboardStats, reportData, loading: dashboardLoading, refetch } = useDashboard();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  const hasAccess = ['admin', 'manager'].includes(userRole || '');

  if (loading || dashboardLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user || !currentRestaurant) {
    return null;
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Acesso Negado</h2>
          <p className="text-muted-foreground mb-4">
            Você não tem permissão para acessar os relatórios
          </p>
          <Button onClick={() => navigate('/')}>
            Voltar ao Início
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/10">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Voltar</span>
            </Button>
            <div className="flex items-center space-x-3">
              <ChefHat className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold text-primary">
                  Relatórios e Dashboards
                </h1>
                <p className="text-sm text-muted-foreground">
                  {currentRestaurant.name}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={refetch}
              className="flex items-center space-x-2"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Atualizar</span>
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={signOut}
              className="flex items-center space-x-2"
            >
              <LogOut className="h-4 w-4" />
              <span>Sair</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {!dashboardStats || !reportData ? (
          <div className="text-center py-12">
            <Loader2 className="h-16 w-16 text-muted-foreground mx-auto mb-4 animate-spin" />
            <h2 className="text-2xl font-bold mb-2">Carregando Dados</h2>
            <p className="text-muted-foreground">
              Processando informações do dashboard...
            </p>
          </div>
        ) : (
          <>
            {/* Dashboard Overview */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-2">Painel de Controle</h2>
              <p className="text-muted-foreground">
                Visão geral do status do estoque, valores e performance
              </p>
            </div>

            {/* Stats Cards */}
            <DashboardStats stats={dashboardStats} />

            {/* Charts */}
            <DashboardCharts 
              monthlyConsumption={dashboardStats.monthlyConsumption}
              categoryDistribution={dashboardStats.categoryDistribution}
            />

            {/* Reports Section */}
            <ReportsSection reportData={reportData} />
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;