import type { CommandHandler, CommandContext } from '@/types/sylo-core';
import { materialService } from '../services/material-service';

// Add Material Command
export const addMaterialCommand: CommandHandler = {
  name: 'add_material',
  description: 'Add a new material to the library',
  parameters: [
    {
      name: 'name',
      type: 'string',
      required: true,
      description: 'Material name',
      validation: { min: 1, max: 255 }
    },
    {
      name: 'description',
      type: 'string',
      required: false,
      description: 'Material description'
    },
    {
      name: 'category',
      type: 'string',
      required: false,
      description: 'Material category (e.g., flooring, paint, fabric)'
    },
    {
      name: 'supplier',
      type: 'string',
      required: false,
      description: 'Supplier name'
    },
    {
      name: 'unit_cost',
      type: 'number',
      required: false,
      description: 'Cost per unit',
      validation: { min: 0 }
    },
    {
      name: 'unit_type',
      type: 'string',
      required: false,
      description: 'Unit type (e.g., sqft, yard, piece)'
    },
    {
      name: 'sku',
      type: 'string',
      required: false,
      description: 'Stock keeping unit (SKU)'
    },
    {
      name: 'specifications',
      type: 'object',
      required: false,
      description: 'Material specifications as key-value pairs'
    },
    {
      name: 'sustainability_rating',
      type: 'number',
      required: false,
      description: 'Sustainability rating (1-10)',
      validation: { min: 1, max: 10 }
    }
  ],
  async execute(params: any, context: CommandContext) {
    const materialData = {
      ...params,
      created_by: context.user.id
    };

    return await materialService.create(materialData);
  }
};

// Update Material Command
export const updateMaterialCommand: CommandHandler = {
  name: 'update_material',
  description: 'Update an existing material',
  parameters: [
    {
      name: 'id',
      type: 'string',
      required: true,
      description: 'Material ID'
    },
    {
      name: 'name',
      type: 'string',
      required: false,
      description: 'Material name',
      validation: { min: 1, max: 255 }
    },
    {
      name: 'description',
      type: 'string',
      required: false,
      description: 'Material description'
    },
    {
      name: 'category',
      type: 'string',
      required: false,
      description: 'Material category'
    },
    {
      name: 'supplier',
      type: 'string',
      required: false,
      description: 'Supplier name'
    },
    {
      name: 'unit_cost',
      type: 'number',
      required: false,
      description: 'Cost per unit',
      validation: { min: 0 }
    },
    {
      name: 'unit_type',
      type: 'string',
      required: false,
      description: 'Unit type'
    },
    {
      name: 'sku',
      type: 'string',
      required: false,
      description: 'Stock keeping unit (SKU)'
    },
    {
      name: 'specifications',
      type: 'object',
      required: false,
      description: 'Material specifications'
    },
    {
      name: 'sustainability_rating',
      type: 'number',
      required: false,
      description: 'Sustainability rating (1-10)',
      validation: { min: 1, max: 10 }
    }
  ],
  async execute(params: any, context: CommandContext) {
    const { id, ...updateData } = params;
    return await materialService.update(id, updateData);
  }
};

// Remove Material Command
export const removeMaterialCommand: CommandHandler = {
  name: 'remove_material',
  description: 'Remove a material from the library (soft delete)',
  parameters: [
    {
      name: 'id',
      type: 'string',
      required: true,
      description: 'Material ID'
    }
  ],
  async execute(params: any, context: CommandContext) {
    return await materialService.delete(params.id);
  }
};

// Get Material Details Command
export const getMaterialDetailsCommand: CommandHandler = {
  name: 'get_material_details',
  description: 'Get detailed information about a material',
  parameters: [
    {
      name: 'id',
      type: 'string',
      required: true,
      description: 'Material ID'
    }
  ],
  async execute(params: any, context: CommandContext) {
    return await materialService.get(params.id);
  }
};

// Search Materials Command
export const searchMaterialsCommand: CommandHandler = {
  name: 'search_materials',
  description: 'Search materials by name, description, or SKU',
  parameters: [
    {
      name: 'query',
      type: 'string',
      required: true,
      description: 'Search query',
      validation: { min: 1 }
    },
    {
      name: 'category',
      type: 'string',
      required: false,
      description: 'Filter by category'
    },
    {
      name: 'supplier',
      type: 'string',
      required: false,
      description: 'Filter by supplier'
    },
    {
      name: 'sustainability_rating',
      type: 'number',
      required: false,
      description: 'Filter by sustainability rating',
      validation: { min: 1, max: 10 }
    },
    {
      name: 'min_cost',
      type: 'number',
      required: false,
      description: 'Minimum cost filter',
      validation: { min: 0 }
    },
    {
      name: 'max_cost',
      type: 'number',
      required: false,
      description: 'Maximum cost filter',
      validation: { min: 0 }
    },
    {
      name: 'page',
      type: 'number',
      required: false,
      description: 'Page number (default: 1)',
      validation: { min: 1 }
    },
    {
      name: 'limit',
      type: 'number',
      required: false,
      description: 'Items per page (default: 50)',
      validation: { min: 1, max: 100 }
    }
  ],
  async execute(params: any, context: CommandContext) {
    const { query, ...filters } = params;
    return await materialService.list({ search: query, ...filters });
  }
};

// List Materials Command
export const listMaterialsCommand: CommandHandler = {
  name: 'list_materials',
  description: 'List materials with optional filtering',
  parameters: [
    {
      name: 'category',
      type: 'string',
      required: false,
      description: 'Filter by category'
    },
    {
      name: 'supplier',
      type: 'string',
      required: false,
      description: 'Filter by supplier'
    },
    {
      name: 'sustainability_rating',
      type: 'number',
      required: false,
      description: 'Filter by sustainability rating',
      validation: { min: 1, max: 10 }
    },
    {
      name: 'min_cost',
      type: 'number',
      required: false,
      description: 'Minimum cost filter',
      validation: { min: 0 }
    },
    {
      name: 'max_cost',
      type: 'number',
      required: false,
      description: 'Maximum cost filter',
      validation: { min: 0 }
    },
    {
      name: 'page',
      type: 'number',
      required: false,
      description: 'Page number (default: 1)',
      validation: { min: 1 }
    },
    {
      name: 'limit',
      type: 'number',
      required: false,
      description: 'Items per page (default: 50)',
      validation: { min: 1, max: 100 }
    },
    {
      name: 'sort_by',
      type: 'string',
      required: false,
      description: 'Field to sort by (default: name)'
    },
    {
      name: 'sort_order',
      type: 'string',
      required: false,
      description: 'Sort order',
      validation: { enum: ['asc', 'desc'] }
    }
  ],
  async execute(params: any, context: CommandContext) {
    return await materialService.list(params);
  }
};

// Get Materials by Category Command
export const getMaterialsByCategoryCommand: CommandHandler = {
  name: 'get_materials_by_category',
  description: 'Get all materials in a specific category',
  parameters: [
    {
      name: 'category',
      type: 'string',
      required: true,
      description: 'Material category'
    }
  ],
  async execute(params: any, context: CommandContext) {
    return await materialService.getMaterialsByCategory(params.category);
  }
};

// Get Materials by Supplier Command
export const getMaterialsBySupplierCommand: CommandHandler = {
  name: 'get_materials_by_supplier',
  description: 'Get all materials from a specific supplier',
  parameters: [
    {
      name: 'supplier',
      type: 'string',
      required: true,
      description: 'Supplier name'
    }
  ],
  async execute(params: any, context: CommandContext) {
    return await materialService.getMaterialsBySupplier(params.supplier);
  }
};

// Get Materials by Sustainability Rating Command
export const getMaterialsBySustainabilityCommand: CommandHandler = {
  name: 'get_materials_by_sustainability',
  description: 'Get materials with a specific sustainability rating',
  parameters: [
    {
      name: 'rating',
      type: 'number',
      required: true,
      description: 'Sustainability rating (1-10)',
      validation: { min: 1, max: 10 }
    }
  ],
  async execute(params: any, context: CommandContext) {
    return await materialService.getMaterialsBySustainabilityRating(params.rating);
  }
};

// Get Materials in Price Range Command
export const getMaterialsInPriceRangeCommand: CommandHandler = {
  name: 'get_materials_in_price_range',
  description: 'Get materials within a specific price range',
  parameters: [
    {
      name: 'min_cost',
      type: 'number',
      required: true,
      description: 'Minimum cost',
      validation: { min: 0 }
    },
    {
      name: 'max_cost',
      type: 'number',
      required: true,
      description: 'Maximum cost',
      validation: { min: 0 }
    }
  ],
  async execute(params: any, context: CommandContext) {
    return await materialService.getMaterialsInPriceRange(params.min_cost, params.max_cost);
  },
  validate(params: any) {
    const errors: string[] = [];
    
    if (params.min_cost > params.max_cost) {
      errors.push('Minimum cost cannot be greater than maximum cost');
    }
    
    return { valid: errors.length === 0, errors };
  }
};

// Update Material Specifications Command
export const updateMaterialSpecificationsCommand: CommandHandler = {
  name: 'update_material_specifications',
  description: 'Update material specifications',
  parameters: [
    {
      name: 'id',
      type: 'string',
      required: true,
      description: 'Material ID'
    },
    {
      name: 'specifications',
      type: 'object',
      required: true,
      description: 'Material specifications as key-value pairs'
    }
  ],
  async execute(params: any, context: CommandContext) {
    return await materialService.updateSpecifications(params.id, params.specifications);
  }
};

// Update Material Pricing Command
export const updateMaterialPricingCommand: CommandHandler = {
  name: 'update_material_pricing',
  description: 'Update material pricing information',
  parameters: [
    {
      name: 'id',
      type: 'string',
      required: true,
      description: 'Material ID'
    },
    {
      name: 'unit_cost',
      type: 'number',
      required: true,
      description: 'Cost per unit',
      validation: { min: 0 }
    },
    {
      name: 'unit_type',
      type: 'string',
      required: false,
      description: 'Unit type (e.g., sqft, yard, piece)'
    }
  ],
  async execute(params: any, context: CommandContext) {
    return await materialService.updatePricing(params.id, params.unit_cost, params.unit_type);
  }
};

// Assign Material to Project Command
export const assignMaterialToProjectCommand: CommandHandler = {
  name: 'assign_material_to_project',
  description: 'Assign a material to a project',
  parameters: [
    {
      name: 'material_id',
      type: 'string',
      required: true,
      description: 'Material ID'
    },
    {
      name: 'project_id',
      type: 'string',
      required: true,
      description: 'Project ID'
    },
    {
      name: 'quantity',
      type: 'number',
      required: false,
      description: 'Quantity needed',
      validation: { min: 0 }
    },
    {
      name: 'unit_price',
      type: 'number',
      required: false,
      description: 'Unit price for this project',
      validation: { min: 0 }
    }
  ],
  async execute(params: any, context: CommandContext) {
    return await materialService.assignToProject(
      params.material_id,
      params.project_id,
      params.quantity,
      params.unit_price
    );
  }
};

// Remove Material from Project Command
export const removeMaterialFromProjectCommand: CommandHandler = {
  name: 'remove_material_from_project',
  description: 'Remove a material assignment from a project',
  parameters: [
    {
      name: 'material_id',
      type: 'string',
      required: true,
      description: 'Material ID'
    },
    {
      name: 'project_id',
      type: 'string',
      required: true,
      description: 'Project ID'
    }
  ],
  async execute(params: any, context: CommandContext) {
    await materialService.removeFromProject(params.material_id, params.project_id);
    return { success: true, message: 'Material removed from project' };
  }
};

// Get Project Materials Command
export const getProjectMaterialsCommand: CommandHandler = {
  name: 'get_project_materials',
  description: 'Get all materials assigned to a project',
  parameters: [
    {
      name: 'project_id',
      type: 'string',
      required: true,
      description: 'Project ID'
    }
  ],
  async execute(params: any, context: CommandContext) {
    return await materialService.getProjectMaterials(params.project_id);
  }
};

// Get Material Categories Command
export const getMaterialCategoriesCommand: CommandHandler = {
  name: 'get_material_categories',
  description: 'Get all available material categories',
  parameters: [],
  async execute(params: any, context: CommandContext) {
    return await materialService.getCategories();
  }
};

// Get Material Suppliers Command
export const getMaterialSuppliersCommand: CommandHandler = {
  name: 'get_material_suppliers',
  description: 'Get all available material suppliers',
  parameters: [],
  async execute(params: any, context: CommandContext) {
    return await materialService.getSuppliers();
  }
};

// Export all material commands
export const materialCommands = [
  addMaterialCommand,
  updateMaterialCommand,
  removeMaterialCommand,
  getMaterialDetailsCommand,
  searchMaterialsCommand,
  listMaterialsCommand,
  getMaterialsByCategoryCommand,
  getMaterialsBySupplierCommand,
  getMaterialsBySustainabilityCommand,
  getMaterialsInPriceRangeCommand,
  updateMaterialSpecificationsCommand,
  updateMaterialPricingCommand,
  assignMaterialToProjectCommand,
  removeMaterialFromProjectCommand,
  getProjectMaterialsCommand,
  getMaterialCategoriesCommand,
  getMaterialSuppliersCommand
];
