import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Tables } from '@/integrations/supabase/types';

export interface Supplier {
  id: string;
  name: string;
  contact_person?: string;
  phone?: string;
  email?: string;
  address?: string;
  products: string[];
  created_at: string;
  updated_at: string;
}

export interface Purchase {
  id: string;
  supplier_name: string;
  item_name: string;
  quantity: number;
  unit_cost: number;
  total_cost: number;
  purchase_date: string;
  created_at: string;
}

export const useSuppliers = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Fetch suppliers from inventory items
  const fetchSuppliers = async () => {
    try {
      const { data: items, error } = await supabase
        .from('inventory_items')
        .select('supplier')
        .not('supplier', 'is', null);

      if (error) throw error;

      // Create unique suppliers list
      const uniqueSuppliers = [...new Set(items?.map(item => item.supplier).filter(Boolean))];
      
      const suppliersData: Supplier[] = uniqueSuppliers.map((supplier, index) => ({
        id: `supplier-${index}`,
        name: supplier || '',
        products: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }));

      setSuppliers(suppliersData);
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  // Fetch purchase history
  const fetchPurchaseHistory = async () => {
    try {
      const { data: items, error } = await supabase
        .from('inventory_items')
        .select('*')
        .not('supplier', 'is', null)
        .not('cost_per_unit', 'is', null);

      if (error) throw error;

      const purchasesData: Purchase[] = items?.map((item, index) => ({
        id: `purchase-${index}`,
        supplier_name: item.supplier || 'Fornecedor Desconhecido',
        item_name: item.name,
        quantity: item.current_quantity,
        unit_cost: item.cost_per_unit || 0,
        total_cost: (item.cost_per_unit || 0) * item.current_quantity,
        purchase_date: item.created_at,
        created_at: item.created_at
      })) || [];

      setPurchases(purchasesData);
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  // Add new supplier
  const addSupplier = async (supplierData: Omit<Supplier, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      // For now, we'll store in local state since there's no suppliers table
      const newSupplier: Supplier = {
        ...supplierData,
        id: `supplier-${Date.now()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      setSuppliers(prev => [...prev, newSupplier]);
      
      toast({
        title: "Sucesso",
        description: "Fornecedor cadastrado com sucesso!"
      });

      return newSupplier;
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    }
  };

  // Update supplier
  const updateSupplier = async (id: string, supplierData: Partial<Supplier>) => {
    try {
      setSuppliers(prev => 
        prev.map(supplier => 
          supplier.id === id 
            ? { ...supplier, ...supplierData, updated_at: new Date().toISOString() }
            : supplier
        )
      );

      toast({
        title: "Sucesso",
        description: "Fornecedor atualizado com sucesso!"
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    }
  };

  // Delete supplier
  const deleteSupplier = async (id: string) => {
    try {
      setSuppliers(prev => prev.filter(supplier => supplier.id !== id));
      
      toast({
        title: "Sucesso",
        description: "Fornecedor removido com sucesso!"
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    }
  };

  // Get purchases by supplier
  const getPurchasesBySupplier = (supplierName: string) => {
    return purchases.filter(purchase => 
      purchase.supplier_name.toLowerCase() === supplierName.toLowerCase()
    );
  };

  // Get total spent by supplier
  const getTotalSpentBySupplier = (supplierName: string) => {
    return getPurchasesBySupplier(supplierName)
      .reduce((total, purchase) => total + purchase.total_cost, 0);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchSuppliers(), fetchPurchaseHistory()]);
      setLoading(false);
    };

    fetchData();
  }, []);

  return {
    suppliers,
    purchases,
    loading,
    addSupplier,
    updateSupplier,
    deleteSupplier,
    getPurchasesBySupplier,
    getTotalSpentBySupplier,
    refetch: () => Promise.all([fetchSuppliers(), fetchPurchaseHistory()])
  };
};