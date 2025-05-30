'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Client, CreateClientData } from '@/types/database';
import { HiXMark, HiPlus } from 'react-icons/hi2';

interface ClientFormProps {
  client?: Client;
  onSubmit: (data: CreateClientData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const CLIENT_TYPES = [
  { value: 'individual', label: 'Individual' },
  { value: 'business', label: 'Business' },
  { value: 'organization', label: 'Organization' }
];

const CONTACT_METHODS = [
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Phone' },
  { value: 'text', label: 'Text' }
];

const LEAD_SOURCES = [
  { value: 'referral', label: 'Referral' },
  { value: 'website', label: 'Website' },
  { value: 'social_media', label: 'Social Media' },
  { value: 'advertising', label: 'Advertising' },
  { value: 'networking', label: 'Networking' },
  { value: 'cold_outreach', label: 'Cold Outreach' },
  { value: 'other', label: 'Other' }
];

export default function ClientForm({ client, onSubmit, onCancel, isLoading }: ClientFormProps) {
  const [formData, setFormData] = useState<CreateClientData>({
    first_name: client?.first_name || '',
    last_name: client?.last_name || '',
    company_name: client?.company_name || '',
    email: client?.email || '',
    phone: client?.phone || '',
    address: client?.address || '',
    city: client?.city || '',
    state: client?.state || '',
    zip_code: client?.zip_code || '',
    country: client?.country || 'US',
    client_type: client?.client_type || 'individual',
    preferred_contact_method: client?.preferred_contact_method || 'email',
    lead_source: client?.lead_source || '',
    referral_source: client?.referral_source || '',
    notes: client?.notes || '',
    tags: client?.tags || []
  });

  const [newTag, setNewTag] = useState('');

  const handleInputChange = (field: keyof CreateClientData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags?.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="circular-bold text-xl">
          {client ? 'Edit Client' : 'New Client'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="first_name" className="circular-bold">First Name *</Label>
              <Input
                id="first_name"
                value={formData.first_name}
                onChange={(e) => handleInputChange('first_name', e.target.value)}
                required
                className="circular-light"
              />
            </div>
            <div>
              <Label htmlFor="last_name" className="circular-bold">Last Name *</Label>
              <Input
                id="last_name"
                value={formData.last_name}
                onChange={(e) => handleInputChange('last_name', e.target.value)}
                required
                className="circular-light"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="company_name" className="circular-bold">Company Name</Label>
            <Input
              id="company_name"
              value={formData.company_name}
              onChange={(e) => handleInputChange('company_name', e.target.value)}
              className="circular-light"
            />
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email" className="circular-bold">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
                className="circular-light"
              />
            </div>
            <div>
              <Label htmlFor="phone" className="circular-bold">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="circular-light"
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <Label htmlFor="address" className="circular-bold">Address</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              className="circular-light"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="city" className="circular-bold">City</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                className="circular-light"
              />
            </div>
            <div>
              <Label htmlFor="state" className="circular-bold">State</Label>
              <Input
                id="state"
                value={formData.state}
                onChange={(e) => handleInputChange('state', e.target.value)}
                className="circular-light"
              />
            </div>
            <div>
              <Label htmlFor="zip_code" className="circular-bold">ZIP Code</Label>
              <Input
                id="zip_code"
                value={formData.zip_code}
                onChange={(e) => handleInputChange('zip_code', e.target.value)}
                className="circular-light"
              />
            </div>
          </div>

          {/* Client Type and Preferences */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="circular-bold">Client Type</Label>
              <Select
                value={formData.client_type}
                onValueChange={(value) => handleInputChange('client_type', value)}
              >
                <SelectTrigger className="circular-light">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CLIENT_TYPES.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="circular-bold">Preferred Contact Method</Label>
              <Select
                value={formData.preferred_contact_method}
                onValueChange={(value) => handleInputChange('preferred_contact_method', value)}
              >
                <SelectTrigger className="circular-light">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CONTACT_METHODS.map(method => (
                    <SelectItem key={method.value} value={method.value}>
                      {method.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Lead Source */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="circular-bold">Lead Source</Label>
              <Select
                value={formData.lead_source}
                onValueChange={(value) => handleInputChange('lead_source', value)}
              >
                <SelectTrigger className="circular-light">
                  <SelectValue placeholder="Select lead source" />
                </SelectTrigger>
                <SelectContent>
                  {LEAD_SOURCES.map(source => (
                    <SelectItem key={source.value} value={source.value}>
                      {source.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="referral_source" className="circular-bold">Referral Source</Label>
              <Input
                id="referral_source"
                value={formData.referral_source}
                onChange={(e) => handleInputChange('referral_source', e.target.value)}
                placeholder="Who referred this client?"
                className="circular-light"
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <Label className="circular-bold">Tags</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add a tag"
                className="circular-light"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              />
              <Button type="button" onClick={addTag} variant="outline" size="sm">
                <HiPlus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags?.map((tag, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-1 hover:text-red-500"
                  >
                    <HiXMark className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes" className="circular-bold">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Additional notes about this client..."
              className="circular-light"
              rows={4}
            />
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={isLoading} className="circular-bold">
              {isLoading ? 'Saving...' : (client ? 'Update Client' : 'Create Client')}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel} className="circular-bold">
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}