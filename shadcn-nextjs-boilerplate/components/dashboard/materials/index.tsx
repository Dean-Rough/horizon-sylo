'use client';

import DashboardLayout from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User } from '@supabase/supabase-js';
import { useState, useEffect } from 'react';
import { 
  HiPlus, 
  HiMagnifyingGlass, 
  HiEye, 
  HiPencil, 
  HiTrash,
  HiSwatches,
  HiCube,
  HiSparkles,
  HiHeart,
  HiShoppingBag,
  HiAdjustmentsHorizontal
} from 'react-icons/hi2';
import { Material } from '@/types/database';

interface Props {
  user: User | null | undefined;
  userDetails: { [x: string]: any } | null;
}

// Mock materials data for development
const mockMaterials: Material[] = [
  {
    id: '1',
    name: 'Velvet Luxe Upholstery',
    description: 'Premium velvet fabric perfect for statement furniture pieces',
    sku: 'VL-001',
    brand: 'Kravet',
    collection: 'Luxe Collection',
    material_type: 'fabric',
    category: 'upholstery',
    subcategory: 'velvet',
    color_primary: 'emerald',
    color_secondary: 'gold',
    pattern: 'solid',
    texture: 'soft',
    finish: 'matte',
    width_inches: 54,
    price_per_yard: 89.99,
    unit_type: 'yard',
    minimum_order: 2,
    in_stock: true,
    lead_time_days: 14,
    discontinued: false,
    supplier_id: 'supplier1',
    care_instructions: 'Professional cleaning recommended',
    durability_rating: 4,
    suitable_for: ['residential', 'commercial'],
    eco_friendly: true,
    certifications: ['GREENGUARD'],
    primary_image_url: '/materials/velvet-emerald.jpg',
    image_urls: ['/materials/velvet-emerald.jpg', '/materials/velvet-emerald-detail.jpg'],
    swatch_image_url: '/materials/velvet-emerald-swatch.jpg',
    tags: ['luxury', 'statement', 'green'],
    search_keywords: ['velvet', 'emerald', 'upholstery', 'luxury'],
    created_by: 'user1',
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z'
  },
  {
    id: '2',
    name: 'Carrara Marble Tile',
    description: 'Classic white marble with subtle gray veining',
    sku: 'CM-12x12',
    brand: 'Stone Source',
    collection: 'Italian Collection',
    material_type: 'tile',
    category: 'flooring',
    subcategory: 'marble',
    color_primary: 'white',
    color_secondary: 'gray',
    pattern: 'abstract',
    texture: 'smooth',
    finish: 'polished',
    width_inches: 12,
    height_inches: 12,
    price_per_sqft: 24.50,
    unit_type: 'sqft',
    minimum_order: 50,
    in_stock: true,
    lead_time_days: 7,
    discontinued: false,
    supplier_id: 'supplier2',
    care_instructions: 'Seal annually, clean with pH neutral cleaners',
    durability_rating: 5,
    suitable_for: ['residential', 'commercial'],
    eco_friendly: false,
    certifications: [],
    primary_image_url: '/materials/carrara-marble.jpg',
    image_urls: ['/materials/carrara-marble.jpg'],
    tags: ['classic', 'luxury', 'timeless'],
    search_keywords: ['marble', 'carrara', 'white', 'tile', 'flooring'],
    created_by: 'user1',
    created_at: '2024-01-10T00:00:00Z',
    updated_at: '2024-01-10T00:00:00Z'
  },
  {
    id: '3',
    name: 'Benjamin Moore Cloud White',
    description: 'Crisp, clean white with subtle warm undertones',
    sku: 'BM-OC-130',
    brand: 'Benjamin Moore',
    collection: 'Off-White Collection',
    material_type: 'paint',
    category: 'wall_finish',
    subcategory: 'interior_paint',
    color_primary: 'white',
    pattern: 'solid',
    texture: 'smooth',
    finish: 'eggshell',
    coverage_sqft: 400,
    price_per_unit: 68.99,
    unit_type: 'gallon',
    minimum_order: 1,
    in_stock: true,
    lead_time_days: 0,
    discontinued: false,
    supplier_id: 'supplier3',
    care_instructions: 'Washable with mild soap and water',
    durability_rating: 4,
    suitable_for: ['residential', 'commercial'],
    eco_friendly: true,
    certifications: ['GREENGUARD Gold', 'LEED'],
    primary_image_url: '/materials/cloud-white.jpg',
    image_urls: ['/materials/cloud-white.jpg'],
    swatch_image_url: '/materials/cloud-white-swatch.jpg',
    tags: ['neutral', 'versatile', 'popular'],
    search_keywords: ['white', 'paint', 'benjamin moore', 'neutral'],
    created_by: 'user1',
    created_at: '2024-01-05T00:00:00Z',
    updated_at: '2024-01-05T00:00:00Z'
  }
];

const materialTypeIcons = {
  fabric: HiSwatches,
  paint: HiSparkles,
  wallpaper: HiCube,
  flooring: HiCube,
  furniture: HiCube,
  lighting: HiSparkles,
  hardware: HiCube,
  tile: HiCube,
  stone: HiCube,
  wood: HiCube
};

const getMaterialTypeColor = (type: string) => {
  switch (type) {
    case 'fabric': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
    case 'paint': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    case 'wallpaper': return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300';
    case 'flooring': return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300';
    case 'tile': return 'bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-300';
    case 'furniture': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case 'lighting': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
  }
};

const getColorDot = (color: string) => {
  const colorMap: Record<string, string> = {
    white: 'bg-white border-2 border-gray-300',
    black: 'bg-black',
    gray: 'bg-gray-500',
    red: 'bg-red-500',
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    emerald: 'bg-emerald-500',
    yellow: 'bg-yellow-500',
    purple: 'bg-purple-500',
    pink: 'bg-pink-500',
    orange: 'bg-orange-500',
    brown: 'bg-amber-700',
    beige: 'bg-amber-200',
    cream: 'bg-amber-100'
  };
  
  return colorMap[color.toLowerCase()] || 'bg-gray-400';
};

export default function Materials(props: Props) {
  const [materials, setMaterials] = useState<Material[]>(mockMaterials);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [filteredMaterials, setFilteredMaterials] = useState<Material[]>(mockMaterials);
  const [loading, setLoading] = useState(false);

  // Filter materials based on search and filters
  useEffect(() => {
    let filtered = materials;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(material =>
        material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        material.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        material.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        material.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
        material.search_keywords.some(keyword => keyword.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Type filter
    if (selectedType !== 'all') {
      filtered = filtered.filter(material => material.material_type === selectedType);
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(material => material.category === selectedCategory);
    }

    setFilteredMaterials(filtered);
  }, [searchTerm, selectedType, selectedCategory, materials]);

  return (
    <DashboardLayout
      user={props.user}
      userDetails={props.userDetails}
      title="Material Library"
      description="Manage your design material library"
    >
      <div className="h-full w-full">
        {/* Header */}
        <div className="relative mb-8">
          <div className="sylo-display sylo-display-lg text-primary absolute -bottom-8 -left-16 z-0 pointer-events-none select-none transform -rotate-90 origin-bottom-left opacity-10">
            MATERIALS
          </div>
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <h1 className="circular-bold text-3xl text-foreground mb-2">
                Material Library
              </h1>
              <p className="circular-light text-lg text-muted-foreground">
                Discover, organize, and manage design materials and finishes
              </p>
            </div>
            <Button className="circular-bold">
              <HiPlus className="h-4 w-4 mr-2" />
              Add Material
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <HiMagnifyingGlass className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search materials, brands, colors, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Type Filter */}
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Material Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="fabric">Fabric</SelectItem>
              <SelectItem value="paint">Paint</SelectItem>
              <SelectItem value="wallpaper">Wallpaper</SelectItem>
              <SelectItem value="flooring">Flooring</SelectItem>
              <SelectItem value="tile">Tile</SelectItem>
              <SelectItem value="furniture">Furniture</SelectItem>
              <SelectItem value="lighting">Lighting</SelectItem>
              <SelectItem value="hardware">Hardware</SelectItem>
            </SelectContent>
          </Select>

          {/* Category Filter */}
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="upholstery">Upholstery</SelectItem>
              <SelectItem value="drapery">Drapery</SelectItem>
              <SelectItem value="flooring">Flooring</SelectItem>
              <SelectItem value="wall_finish">Wall Finish</SelectItem>
              <SelectItem value="accent">Accent</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="sm">
            <HiAdjustmentsHorizontal className="h-4 w-4 mr-2" />
            More Filters
          </Button>
        </div>

        {/* Results Summary */}
        <div className="mb-4 flex items-center justify-between">
          <p className="circular-light text-sm text-muted-foreground">
            Showing {filteredMaterials.length} of {materials.length} materials
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <HiHeart className="h-4 w-4 mr-2" />
              Favorites
            </Button>
            <Button variant="outline" size="sm">
              <HiShoppingBag className="h-4 w-4 mr-2" />
              Collections
            </Button>
          </div>
        </div>

        {/* Materials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMaterials.map((material) => {
            const IconComponent = materialTypeIcons[material.material_type] || HiCube;
            
            return (
              <Card key={material.id} className="hover:shadow-lg transition-shadow group">
                <CardHeader className="pb-3">
                  {/* Material Image */}
                  <div className="aspect-square rounded-lg bg-muted mb-3 relative overflow-hidden">
                    {material.primary_image_url ? (
                      <img 
                        src={material.primary_image_url} 
                        alt={material.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <IconComponent className="h-12 w-12 text-muted-foreground" />
                      </div>
                    )}
                    
                    {/* Action Buttons */}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex gap-1">
                        <Button variant="secondary" size="sm">
                          <HiEye className="h-3 w-3" />
                        </Button>
                        <Button variant="secondary" size="sm">
                          <HiHeart className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    {/* Color Indicator */}
                    {material.color_primary && (
                      <div className="absolute bottom-2 left-2">
                        <div className={`w-4 h-4 rounded-full ${getColorDot(material.color_primary)}`} />
                      </div>
                    )}
                  </div>

                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="circular-bold text-sm leading-tight mb-1">
                        {material.name}
                      </CardTitle>
                      <p className="circular-light text-xs text-muted-foreground">
                        {material.brand} {material.collection && `• ${material.collection}`}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-1 mt-2">
                    <Badge className={getMaterialTypeColor(material.material_type)} variant="secondary">
                      {material.material_type}
                    </Badge>
                    {material.eco_friendly && (
                      <Badge variant="outline" className="text-green-600">
                        Eco
                      </Badge>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="space-y-2 text-sm">
                    {/* Pricing */}
                    {material.price_per_unit && (
                      <div className="flex justify-between">
                        <span className="circular-light text-muted-foreground">Price:</span>
                        <span className="circular-bold">
                          ${material.price_per_unit}
                          {material.price_per_sqft && ` / ${material.unit_type}`}
                        </span>
                      </div>
                    )}

                    {/* Availability */}
                    <div className="flex justify-between">
                      <span className="circular-light text-muted-foreground">Stock:</span>
                      <Badge variant={material.in_stock ? "default" : "secondary"}>
                        {material.in_stock ? 'In Stock' : 'Out of Stock'}
                      </Badge>
                    </div>

                    {/* Lead Time */}
                    {material.lead_time_days && (
                      <div className="flex justify-between">
                        <span className="circular-light text-muted-foreground">Lead Time:</span>
                        <span className="circular-bold text-xs">
                          {material.lead_time_days} days
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Tags */}
                  {material.tags && material.tags.length > 0 && (
                    <div className="flex gap-1 flex-wrap mt-3">
                      {material.tags.slice(0, 2).map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {material.tags.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{material.tags.length - 2}
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm" className="flex-1">
                      <HiEye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm">
                      <HiShoppingBag className="h-3 w-3" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <HiPencil className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredMaterials.length === 0 && (
          <div className="text-center py-12">
            <HiSwatches className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="circular-bold text-lg mb-2">No materials found</h3>
            <p className="circular-light text-muted-foreground mb-4">
              {searchTerm || selectedType !== 'all' || selectedCategory !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Start building your material library by adding your first material'
              }
            </p>
            <Button>
              <HiPlus className="h-4 w-4 mr-2" />
              Add Material
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
