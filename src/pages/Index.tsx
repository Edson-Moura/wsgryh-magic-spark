import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useRestaurant } from '@/hooks/useRestaurant';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, LogOut, Users, ChefHat, Package, BarChart3, Settings } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const { user, signOut, loading } = useAuth();
  const { currentRestaurant, userRole, loading: restaurantLoading } = useRestaurant();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  const getRoleBadgeVariant = (role: string | null) => {
    switch (role) {
      case 'admin': return 'default';
      case 'manager': return 'secondary';
      case 'chef': return 'outline';
      case 'inventory': return 'outline';
      case 'staff': return 'outline';
      default: return 'outline';
    }
  };

  const getRoleDisplayName = (role: string | null) => {
    switch (role) {
      case 'admin': return 'Administrador';
      case 'manager': return 'Gerente';
      case 'chef': return 'Chef';
      case 'inventory': return 'Estoque';
      case 'staff': return 'Funcionário';
      default: return 'Sem Role';
    }
  };

  if (loading || restaurantLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/10">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <ChefHat className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold text-primary">
                {currentRestaurant?.name || 'RestaurantApp'}
              </h1>
              <p className="text-sm text-muted-foreground">Sistema de Gestão</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="flex items-center space-x-2">
                <p className="text-sm font-medium">Bem-vindo!</p>
                {userRole && (
                  <Badge variant={getRoleBadgeVariant(userRole)}>
                    {getRoleDisplayName(userRole)}
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
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
        {!currentRestaurant ? (
          // No restaurant setup
          <div className="text-center py-12">
            <ChefHat className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Configure seu Restaurante</h2>
            <p className="text-muted-foreground mb-6">
              Para começar a usar o sistema, você precisa configurar seu restaurante
            </p>
            <Button onClick={() => navigate('/restaurant-setup')}>
              Configurar Restaurante
            </Button>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-2">Dashboard</h2>
              <p className="text-muted-foreground">
                Gerencie todos os aspectos do seu restaurante em um só lugar
              </p>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle>Gestão de Usuários</CardTitle>
                      <CardDescription>
                        Gerencie funcionários e permissões
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Controle de acesso para diferentes perfis: admin, gerente, chef, funcionário do estoque.
                  </p>
                  <Button 
                    variant="outline" 
                    className="w-full mt-4"
                    disabled={!['admin', 'manager'].includes(userRole || '')}
                  >
                    {['admin', 'manager'].includes(userRole || '') ? 'Acessar' : 'Sem Permissão'}
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Package className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle>Controle de Estoque</CardTitle>
                      <CardDescription>
                        Monitore ingredientes e produtos
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Alertas de baixo estoque, datas de validade e sugestões de reposição automáticas.
                  </p>
                  <Button 
                    variant="outline" 
                    className="w-full mt-4" 
                    disabled={!['admin', 'manager', 'inventory'].includes(userRole || '')}
                  >
                    {['admin', 'manager', 'inventory'].includes(userRole || '') ? 'Em breve' : 'Sem Permissão'}
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer" 
                    onClick={() => ['admin', 'manager'].includes(userRole || '') && navigate('/dashboard')}>
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <BarChart3 className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle>Relatórios</CardTitle>
                      <CardDescription>
                        Análises e métricas do negócio
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Dashboards com vendas, custos, performance de pratos e análise de lucratividade.
                  </p>
                  <Button 
                    variant="outline" 
                    className="w-full mt-4" 
                    disabled={!['admin', 'manager'].includes(userRole || '')}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (['admin', 'manager'].includes(userRole || '')) {
                        navigate('/dashboard');
                      }
                    }}
                  >
                    {['admin', 'manager'].includes(userRole || '') ? 'Acessar Dashboard' : 'Sem Permissão'}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="mt-12">
              <Card>
                <CardHeader>
                  <CardTitle>Ações Rápidas</CardTitle>
                  <CardDescription>
                    Configurações e ações importantes para seu restaurante
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {userRole === 'admin' && (
                      <Button className="justify-start h-auto p-4" onClick={() => navigate('/restaurant-setup')}>
                        <div className="text-left">
                          <div className="font-medium flex items-center space-x-2">
                            <Settings className="h-4 w-4" />
                            <span>Configurar Restaurante</span>
                          </div>
                          <div className="text-sm text-primary-foreground/80">
                            Edite informações básicas do seu estabelecimento
                          </div>
                        </div>
                      </Button>
                    )}
                    {['admin', 'manager'].includes(userRole || '') && (
                      <Button variant="outline" className="justify-start h-auto p-4">
                        <div className="text-left">
                          <div className="font-medium flex items-center space-x-2">
                            <Users className="h-4 w-4" />
                            <span>Convidar Equipe</span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Adicione funcionários ao sistema
                          </div>
                        </div>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Index;
