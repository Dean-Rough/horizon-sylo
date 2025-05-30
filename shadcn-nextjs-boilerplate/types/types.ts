import Stripe from 'stripe';
import { ComponentType, ReactNode } from 'react';

export type OpenAIModel =
  | 'gpt-3.5-turbo'
  | 'gpt-4'
  | 'gpt-4-1106-preview'
  | 'gpt-4o';

export interface TranslateBody {
  // inputLanguage: string;
  // outputLanguage: string;
  topic: string;
  paragraphs: string;
  essayType: string;
  model: OpenAIModel;
  type?: 'review' | 'refactor' | 'complexity' | 'normal';
}
export interface ChatBody {
  inputMessage: string;
  model: OpenAIModel;
  apiKey?: string | undefined | null;
}
export interface TranslateResponse {
  code: string;
}

export interface PageMeta {
  title: string;
  description: string;
  cardImage: string;
}

export interface Customer {
  id: string /* primary key */;
  stripe_customer_id?: string;
}

export interface Product {
  id: string /* primary key */;
  active?: boolean;
  name?: string;
  description?: string;
  image?: string;
  metadata?: Stripe.Metadata;
}

export interface ProductWithPrice extends Product {
  prices?: Price[];
}

export interface UserDetails {
  id: string /* primary key */;
  first_name: string;
  last_name: string;
  full_name?: string;
  avatar_url?: string;
  billing_address?: Stripe.Address;
  payment_method?: Stripe.PaymentMethod[Stripe.PaymentMethod.Type];
}

export interface Price {
  id: string /* primary key */;
  product_id?: string /* foreign key to products.id */;
  active?: boolean;
  description?: string;
  unit_amount?: number;
  currency?: string;
  type?: Stripe.Price.Type;
  interval?: Stripe.Price.Recurring.Interval;
  interval_count?: number;
  trial_period_days?: number | null;
  metadata?: Stripe.Metadata;
  products?: Product;
}

export interface PriceWithProduct extends Price {}

export interface Subscription {
  id: string /* primary key */;
  user_id: string;
  status?: Stripe.Subscription.Status;
  metadata?: Stripe.Metadata;
  price_id?: string /* foreign key to prices.id */;
  quantity?: number;
  cancel_at_period_end?: boolean;
  created: string;
  current_period_start: string;
  current_period_end: string;
  ended_at?: string;
  cancel_at?: string;
  canceled_at?: string;
  trial_start?: string;
  trial_end?: string;
  prices?: Price;
}

export interface IRoute {
  path: string;
  name: string;
  layout?: string;
  exact?: boolean;
  component?: ComponentType;
  disabled?: boolean;
  icon?: JSX.Element;
  secondary?: boolean;
  collapse?: boolean;
  items?: IRoute[];
  rightElement?: boolean;
  invisible?: boolean;
}

export interface EssayBody {
  topic: string;
  words: '300' | '200';
  essayType: '' | 'Argumentative' | 'Classic' | 'Persuasive' | 'Critique';
  model: OpenAIModel;
  apiKey?: string | undefined;
}
export interface PremiumEssayBody {
  words: string;
  topic: string;
  essayType:
    | ''
    | 'Argumentative'
    | 'Classic'
    | 'Persuasive'
    | 'Memoir'
    | 'Critique'
    | 'Compare/Contrast'
    | 'Narrative'
    | 'Descriptive'
    | 'Expository'
    | 'Cause and Effect'
    | 'Reflective'
    | 'Informative';
  tone: string;
  citation: string;
  level: string;
  model: OpenAIModel;
  apiKey?: string | undefined;
}

// Re-export database types for convenience
export type {
  Client,
  Project,
  Task,
  Supplier,
  Material,
  MaterialCollection,
  CollectionMaterial,
  ProjectAsset,
  MaterialSample,
  CreateClientData,
  CreateProjectData,
  CreateTaskData,
  ProjectsResponse,
  ClientsResponse,
  TasksResponse,
  ProjectFilters,
  ClientFilters,
  TaskFilters,
  SortOptions,
  ProjectStats,
  TaskStats
} from './database';

// Additional utility types for the new Phase 2 & 3 features
export interface MaterialFilters {
  material_type?: string[];
  category?: string[];
  brand?: string[];
  supplier_id?: string;
  color_primary?: string[];
  pattern?: string[];
  texture?: string[];
  finish?: string[];
  price_min?: number;
  price_max?: number;
  in_stock?: boolean;
  eco_friendly?: boolean;
  search?: string;
}

export interface SupplierFilters {
  supplier_type?: string[];
  trade_only?: boolean;
  active?: boolean;
  preferred?: boolean;
  search?: string;
}

export interface MaterialCollectionFilters {
  collection_type?: string[];
  project_id?: string;
  is_public?: boolean;
  search?: string;
}

export interface ProjectAssetFilters {
  asset_type?: string[];
  asset_category?: string[];
  project_id?: string;
  material_id?: string;
  approval_status?: string[];
  search?: string;
}

// Dashboard statistics for Phase 3
export interface MaterialStats {
  total_materials: number;
  materials_by_type: Record<string, number>;
  total_suppliers: number;
  active_suppliers: number;
  total_collections: number;
  total_assets: number;
  pending_samples: number;
}

// Form data types for Phase 3
export interface CreateSupplierData {
  name: string;
  description?: string;
  website_url?: string;
  contact_name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  country?: string;
  supplier_type?: 'manufacturer' | 'distributor' | 'retailer' | 'trade_only';
  trade_only?: boolean;
  minimum_order_amount?: number;
  payment_terms?: string;
  shipping_info?: string;
  account_number?: string;
  discount_percentage?: number;
  rep_name?: string;
  rep_email?: string;
  rep_phone?: string;
  notes?: string;
  tags?: string[];
}

export interface CreateMaterialData {
  name: string;
  description?: string;
  sku?: string;
  brand?: string;
  collection?: string;
  material_type: 'fabric' | 'paint' | 'wallpaper' | 'flooring' | 'furniture' | 'lighting' | 'hardware' | 'tile' | 'stone' | 'wood';
  category?: string;
  subcategory?: string;
  color_primary?: string;
  color_secondary?: string;
  pattern?: 'solid' | 'stripe' | 'floral' | 'geometric' | 'abstract';
  texture?: 'smooth' | 'rough' | 'soft' | 'hard' | 'glossy' | 'matte';
  finish?: 'matte' | 'satin' | 'semi-gloss' | 'gloss' | 'natural' | 'stained';
  width_inches?: number;
  height_inches?: number;
  depth_inches?: number;
  weight_lbs?: number;
  coverage_sqft?: number;
  price_per_unit?: number;
  price_per_sqft?: number;
  price_per_yard?: number;
  unit_type?: 'each' | 'sqft' | 'yard' | 'roll' | 'gallon';
  minimum_order?: number;
  lead_time_days?: number;
  supplier_id?: string;
  supplier_sku?: string;
  care_instructions?: string;
  durability_rating?: number;
  suitable_for?: string[];
  eco_friendly?: boolean;
  certifications?: string[];
  primary_image_url?: string;
  image_urls?: string[];
  swatch_image_url?: string;
  specification_sheet_url?: string;
  tags?: string[];
  search_keywords?: string[];
}

export interface CreateMaterialCollectionData {
  name: string;
  description?: string;
  collection_type?: 'custom' | 'mood_board' | 'project_palette' | 'favorites';
  project_id?: string;
  is_public?: boolean;
  shared_with?: string[];
  tags?: string[];
  notes?: string;
}

export interface CreateProjectAssetData {
  filename: string;
  original_filename: string;
  file_path: string;
  file_size?: number;
  mime_type?: string;
  asset_type: 'image' | 'document' | 'video' | 'audio' | '3d_model' | 'cad_file';
  asset_category?: 'inspiration' | 'specification' | 'presentation' | 'contract' | 'invoice' | 'photo';
  project_id?: string;
  material_id?: string;
  title?: string;
  description?: string;
  tags?: string[];
}

export interface CreateMaterialSampleData {
  material_id: string;
  sample_type?: 'physical' | 'digital' | 'memo';
  size_description?: string;
  quantity_available?: number;
  location?: string;
  requested_for_project?: string;
  notes?: string;
}
