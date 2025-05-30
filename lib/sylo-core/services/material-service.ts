import type { MaterialService } from '@/types/sylo-core';
import type { Material } from '@/types/database-types';
import { createClient } from '@/lib/supabase';

export class MaterialServiceImpl implements MaterialService {
  private async getSupabase() {
    return await createClient();
  }

  async create(data: {
    name: string;
    description?: string;
    category?: string;
    supplier?: string;
    unit_cost?: number;
    unit_type?: string;
    sku?: string;
    specifications?: Record<string, any>;
    sustainability_rating?: number;
    created_by: string;
  }): Promise<Material> {
    const supabase = await this.getSupabase();
    
    const { data: material, error } = await supabase
      .from('materials')
      .insert(data)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create material: ${error.message}`);
    }

    return material;
  }

  async update(id: string, data: Partial<Material>): Promise<Material> {
    const supabase = await this.getSupabase();
    
    const { data: material, error } = await supabase
      .from('materials')
      .update({
        ...data,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update material: ${error.message}`);
    }

    return material;
  }

  async delete(id: string): Promise<Material> {
    const supabase = await this.getSupabase();
    
    const { data: material, error } = await supabase
      .from('materials')
      .update({
        deleted_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to delete material: ${error.message}`);
    }

    return material;
  }

  async get(id: string): Promise<Material> {
    const supabase = await this.getSupabase();
    
    const { data: material, error } = await supabase
      .from('materials')
      .select('*')
      .eq('id', id)
      .is('deleted_at', null)
      .single();

    if (error) {
      throw new Error(`Failed to get material: ${error.message}`);
    }

    return material;
  }

  async list(filters: {
    category?: string;
    supplier?: string;
    sustainability_rating?: number;
    min_cost?: number;
    max_cost?: number;
    search?: string;
    page?: number;
    limit?: number;
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
  } = {}): Promise<Material[]> {
    const supabase = await this.getSupabase();
    
    const {
      category,
      supplier,
      sustainability_rating,
      min_cost,
      max_cost,
      search,
      page = 1,
      limit = 50,
      sort_by = 'name',
      sort_order = 'asc'
    } = filters;

    const offset = (page - 1) * limit;

    let query = supabase
      .from('materials')
      .select('*')
      .is('deleted_at', null)
      .range(offset, offset + limit - 1)
      .order(sort_by, { ascending: sort_order === 'asc' });

    // Apply filters
    if (category) query = query.eq('category', category);
    if (supplier) query = query.eq('supplier', supplier);
    if (sustainability_rating) query = query.eq('sustainability_rating', sustainability_rating);
    if (min_cost) query = query.gte('unit_cost', min_cost);
    if (max_cost) query = query.lte('unit_cost', max_cost);
    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%,sku.ilike.%${search}%`);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Failed to list materials: ${error.message}`);
    }

    return (data as unknown as Material[]) || [];
  }

  async searchMaterials(query: string): Promise<Material[]> {
    return this.list({ search: query });
  }

  async getMaterialsByCategory(category: string): Promise<Material[]> {
    return this.list({ category });
  }

  async getMaterialsBySupplier(supplier: string): Promise<Material[]> {
    return this.list({ supplier });
  }

  async getMaterialsBySustainabilityRating(rating: number): Promise<Material[]> {
    return this.list({ sustainability_rating: rating });
  }

  async getMaterialsInPriceRange(minCost: number, maxCost: number): Promise<Material[]> {
    return this.list({ min_cost: minCost, max_cost: maxCost });
  }

  async updateSpecifications(id: string, specifications: Record<string, any>): Promise<Material> {
    return this.update(id, { specifications });
  }

  async updatePricing(id: string, unitCost: number, unitType?: string): Promise<Material> {
    return this.update(id, { unit_cost: unitCost, unit_type: unitType });
  }

  async updateSustainabilityRating(id: string, rating: number): Promise<Material> {
    return this.update(id, { sustainability_rating: rating });
  }

  async getCategories(): Promise<string[]> {
    const supabase = await this.getSupabase();
    
    const { data, error } = await supabase
      .from('materials')
      .select('category')
      .is('deleted_at', null)
      .not('category', 'is', null);

    if (error) {
      throw new Error(`Failed to get categories: ${error.message}`);
    }

    // Extract unique categories
    const categories = [...new Set((data as any[])?.map(item => item.category).filter(Boolean))];
    return categories;
  }

  async getSuppliers(): Promise<string[]> {
    const supabase = await this.getSupabase();
    
    const { data, error } = await supabase
      .from('materials')
      .select('supplier')
      .is('deleted_at', null)
      .not('supplier', 'is', null);

    if (error) {
      throw new Error(`Failed to get suppliers: ${error.message}`);
    }

    // Extract unique suppliers
    const suppliers = [...new Set((data as any[])?.map(item => item.supplier).filter(Boolean))];
    return suppliers;
  }

  async assignToProject(materialId: string, projectId: string, quantity?: number, unitPrice?: number): Promise<any> {
    const supabase = await this.getSupabase();
    
    const { data, error } = await supabase
      .from('project_materials')
      .insert({
        material_id: materialId,
        project_id: projectId,
        quantity,
        unit_price: unitPrice,
        status: 'pending'
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to assign material to project: ${error.message}`);
    }

    return data;
  }

  async removeFromProject(materialId: string, projectId: string): Promise<void> {
    const supabase = await this.getSupabase();
    
    const { error } = await supabase
      .from('project_materials')
      .delete()
      .eq('material_id', materialId)
      .eq('project_id', projectId);

    if (error) {
      throw new Error(`Failed to remove material from project: ${error.message}`);
    }
  }

  async getProjectMaterials(projectId: string): Promise<any[]> {
    const supabase = await this.getSupabase();
    
    const { data, error } = await supabase
      .from('project_materials')
      .select(`
        *,
        materials (*)
      `)
      .eq('project_id', projectId);

    if (error) {
      throw new Error(`Failed to get project materials: ${error.message}`);
    }

    return data || [];
  }
}

// Export singleton instance
export const materialService = new MaterialServiceImpl();
