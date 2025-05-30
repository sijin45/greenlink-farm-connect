
import { supabase } from '@/integrations/supabase/client';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  category: string;
  unit: string;
  image_url: string;
  farmer_id: string;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  customer_id: string;
  total_amount: number;
  status: string;
  payment_status: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

// Products API
export const productsApi = {
  async getAll(): Promise<Product[]> {
    const { data, error } = await supabase.functions.invoke('products', {
      method: 'GET',
    });
    if (error) throw error;
    return data;
  },

  async getById(id: string): Promise<Product> {
    const { data, error } = await supabase.functions.invoke('products', {
      method: 'GET',
      body: { id },
    });
    if (error) throw error;
    return data;
  },

  async create(product: Omit<Product, 'id' | 'farmer_id' | 'created_at' | 'updated_at'>): Promise<Product> {
    const { data, error } = await supabase.functions.invoke('products', {
      method: 'POST',
      body: product,
    });
    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<Product>): Promise<Product> {
    const { data, error } = await supabase.functions.invoke('products', {
      method: 'PUT',
      body: { id, ...updates },
    });
    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { data, error } = await supabase.functions.invoke('products', {
      method: 'DELETE',
      body: { id },
    });
    if (error) throw error;
    return data;
  },
};

// Orders API
export const ordersApi = {
  async getAll(): Promise<Order[]> {
    const { data, error } = await supabase.functions.invoke('orders', {
      method: 'GET',
    });
    if (error) throw error;
    return data;
  },

  async getById(id: string): Promise<Order> {
    const { data, error } = await supabase.functions.invoke('orders', {
      method: 'GET',
      body: { id },
    });
    if (error) throw error;
    return data;
  },

  async create(orderData: { items: OrderItem[]; total_amount: number }): Promise<{ order: Order; items: OrderItem[] }> {
    const { data, error } = await supabase.functions.invoke('orders', {
      method: 'POST',
      body: orderData,
    });
    if (error) throw error;
    return data;
  },

  async updateStatus(id: string, status: string, payment_status?: string): Promise<Order> {
    const { data, error } = await supabase.functions.invoke('orders', {
      method: 'PUT',
      body: { id, status, payment_status },
    });
    if (error) throw error;
    return data;
  },
};

// Profiles API
export const profilesApi = {
  async getCurrent(): Promise<any> {
    const { data, error } = await supabase.functions.invoke('profiles', {
      method: 'GET',
    });
    if (error) throw error;
    return data;
  },

  async getById(id: string): Promise<any> {
    const { data, error } = await supabase.functions.invoke('profiles', {
      method: 'GET',
      body: { id },
    });
    if (error) throw error;
    return data;
  },

  async update(updates: any, id?: string): Promise<any> {
    const { data, error } = await supabase.functions.invoke('profiles', {
      method: 'PUT',
      body: { ...updates, id },
    });
    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { data, error } = await supabase.functions.invoke('profiles', {
      method: 'DELETE',
      body: { id },
    });
    if (error) throw error;
    return data;
  },
};

// Analytics API
export const analyticsApi = {
  async getDashboard(): Promise<any> {
    const { data, error } = await supabase.functions.invoke('analytics', {
      method: 'GET',
      body: { type: 'dashboard' },
    });
    if (error) throw error;
    return data;
  },

  async getSales(): Promise<any> {
    const { data, error } = await supabase.functions.invoke('analytics', {
      method: 'GET',
      body: { type: 'sales' },
    });
    if (error) throw error;
    return data;
  },

  async getProducts(): Promise<any> {
    const { data, error } = await supabase.functions.invoke('analytics', {
      method: 'GET',
      body: { type: 'products' },
    });
    if (error) throw error;
    return data;
  },
};
