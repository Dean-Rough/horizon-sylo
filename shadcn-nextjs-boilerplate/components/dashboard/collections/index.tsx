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
  HiHeart,
  HiShare,
  HiUsers,
  HiSparkles,
  HiRectangleGroup,
  HiSwatches
} from 'react-icons/hi2';
import { MaterialCollection } from '@/types/database';

interface Props {
  user: User | null | undefined;
  userDetails: { [x: string]: any } | null;
}

// Mock collections data for development
const mockCollections: MaterialCollection[] = [
  {
    id: '1',
    name: 'Modern Minimalist Living Room',
    description: 'Clean lines, neutral palette, natural textures',
    collection_type: 'mood_board',
    project_id: 'project1',
    created_by: 'user1',
    is_public: false,
    shared_with: [],
    tags: ['modern', 'minimalist', 'neutral'],
    notes: 'Focus on warm whites and natural wood tones',
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-20T00:00:00Z',
    material_count: 8
  },
  {
    id: '2',
    name: 'Luxury Hotel Suite Palette',
    description: 'Rich textures and sophisticated color scheme',
    collection_type: 'project_palette',
    project_id: 'project2',
    created_by: 'user1',
    is_public: true,
    shared_with: ['user2', 'user3'],
    tags: ['luxury', 'hospitality', 'rich'],
    notes: 'Deep blues and gold accents with marble elements',
    created_at: '2024-01-10T00:00:00Z',
    updated_at: '2024-01-18T00:00:00Z',
    material_count: 12
  },
  {
    id: '3',
    name: 'Favorite Fabrics',
    description: 'My go-to upholstery and drapery selections',
    collection_type: 'favorites',
    created_by: 'user1',
    is_public: false,
    shared_with: [],
    tags: ['fabrics', 'upholstery', 'drapery'],
    notes: 'Reliable suppliers and timeless patterns',
    created_at: '2024-01-05T00:00:00Z',
    updated_at: '2024-01-25T00:00:00Z',
    material_count: 15
  },
  {
    id: '4',
    name: 'Sustainable Materials',
    description: 'Eco-friendly and certified green materials',
    collection_type: 'custom',
    created_by: 'user1',
    is_public: true,
    shared_with: [],
    tags: ['sustainable', 'eco-friendly', 'green'],
    notes: 'LEED and GREENGUARD certified options',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
    material_count: 6
  }
];

const getCollectionTypeIcon = (type: string) => {
  switch (type) {
    case 'mood_board': return HiSparkles;
    case 'project_palette': return HiRectangleGroup;
    case 'favorites': return HiHeart;
    case 'custom': return HiSwatches;
    default: return HiSwatches;
  }
};

const getCollectionTypeColor = (type: string) => {
  switch (type) {
    case 'mood_board': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
    case 'project_palette': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    case 'favorites': return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300';
    case 'custom': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
  }
};

export default function Collections(props: Props) {
  const [collections, setCollections] = useState<MaterialCollection[]>(mockCollections);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [filteredCollections, setFilteredCollections] = useState<MaterialCollection[]>(mockCollections);
  const [loading, setLoading] = useState(false);

  // Filter collections based on search and filters
  useEffect(() => {
    let filtered = collections;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(collection =>
        collection.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        collection.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        collection.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Type filter
    if (selectedType !== 'all') {
      filtered = filtered.filter(collection => collection.collection_type === selectedType);
    }

    setFilteredCollections(filtered);
  }, [searchTerm, selectedType, collections]);

  return (
    <DashboardLayout
      user={props.user}
      userDetails={props.userDetails}
      title="Material Collections"
      description="Organize materials into collections and mood boards"
    >
      <div className="h-full w-full">
        {/* Header */}
        <div className="relative mb-8">
          <div className="sylo-display sylo-display-lg text-primary absolute -bottom-8 -left-16 z-0 pointer-events-none select-none transform -rotate-90 origin-bottom-left opacity-10">
            COLLECTIONS
          </div>
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <h1 className="circular-bold text-3xl text-foreground mb-2">
                Material Collections
              </h1>
              <p className="circular-light text-lg text-muted-foreground">
                Create mood boards, project palettes, and organize your favorite materials
              </p>
            </div>
            <Button className="circular-bold">
              <HiPlus className="h-4 w-4 mr-2" />
              New Collection
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <HiMagnifyingGlass className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search collections, descriptions, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Type Filter */}
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Collection Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="mood_board">Mood Boards</SelectItem>
              <SelectItem value="project_palette">Project Palettes</SelectItem>
              <SelectItem value="favorites">Favorites</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Results Summary */}
        <div className="mb-4 flex items-center justify-between">
          <p className="circular-light text-sm text-muted-foreground">
            Showing {filteredCollections.length} of {collections.length} collections
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <HiUsers className="h-4 w-4 mr-2" />
              Shared with Me
            </Button>
            <Button variant="outline" size="sm">
              <HiShare className="h-4 w-4 mr-2" />
              Public Collections
            </Button>
          </div>
        </div>

        {/* Collections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCollections.map((collection) => {
            const IconComponent = getCollectionTypeIcon(collection.collection_type);
            
            return (
              <Card key={collection.id} className="hover:shadow-lg transition-shadow group">
                <CardHeader className="pb-3">
                  {/* Collection Preview */}
                  <div className="aspect-video rounded-lg bg-gradient-to-br from-muted to-muted/50 mb-3 relative overflow-hidden">
                    {/* Mock material swatches preview */}
                    <div className="absolute inset-0 p-4">
                      <div className="grid grid-cols-4 gap-2 h-full">
                        {Array.from({ length: Math.min(8, collection.material_count || 0) }).map((_, i) => (
                          <div 
                            key={i} 
                            className={`rounded ${
                              i % 4 === 0 ? 'bg-blue-200' :
                              i % 4 === 1 ? 'bg-green-200' :
                              i % 4 === 2 ? 'bg-purple-200' : 'bg-amber-200'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex gap-1">
                        <Button variant="secondary" size="sm">
                          <HiEye className="h-3 w-3" />
                        </Button>
                        <Button variant="secondary" size="sm">
                          <HiShare className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    {/* Collection Type Icon */}
                    <div className="absolute bottom-2 left-2">
                      <div className="bg-background/80 backdrop-blur-sm rounded-full p-1">
                        <IconComponent className="h-4 w-4" />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="circular-bold text-lg leading-tight mb-1">
                        {collection.name}
                      </CardTitle>
                      <p className="circular-light text-sm text-muted-foreground mb-2">
                        {collection.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 items-center">
                    <Badge className={getCollectionTypeColor(collection.collection_type)} variant="secondary">
                      {collection.collection_type.replace('_', ' ')}
                    </Badge>
                    {collection.is_public && (
                      <Badge variant="outline">
                        Public
                      </Badge>
                    )}
                    {collection.shared_with.length > 0 && (
                      <Badge variant="outline">
                        <HiUsers className="h-3 w-3 mr-1" />
                        {collection.shared_with.length}
                      </Badge>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="space-y-3">
                    {/* Material Count */}
                    <div className="flex justify-between items-center">
                      <span className="circular-light text-sm text-muted-foreground">Materials:</span>
                      <span className="circular-bold text-sm">
                        {collection.material_count || 0} items
                      </span>
                    </div>

                    {/* Project Link */}
                    {collection.project_id && (
                      <div className="flex justify-between items-center">
                        <span className="circular-light text-sm text-muted-foreground">Project:</span>
                        <Button variant="link" size="sm" className="h-auto p-0">
                          View Project
                        </Button>
                      </div>
                    )}

                    {/* Last Updated */}
                    <div className="flex justify-between items-center">
                      <span className="circular-light text-sm text-muted-foreground">Updated:</span>
                      <span className="circular-light text-sm">
                        {new Date(collection.updated_at).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Tags */}
                    {collection.tags && collection.tags.length > 0 && (
                      <div className="flex gap-1 flex-wrap">
                        {collection.tags.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {collection.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{collection.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <HiEye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        <HiPencil className="h-3 w-3" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <HiShare className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredCollections.length === 0 && (
          <div className="text-center py-12">
            <HiRectangleGroup className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="circular-bold text-lg mb-2">No collections found</h3>
            <p className="circular-light text-muted-foreground mb-4">
              {searchTerm || selectedType !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Start organizing your materials by creating your first collection'
              }
            </p>
            <Button>
              <HiPlus className="h-4 w-4 mr-2" />
              Create Collection
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
