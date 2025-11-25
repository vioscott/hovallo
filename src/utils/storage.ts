import { supabase } from './supabase';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'tenant' | 'landlord' | 'agent' | 'admin';
  isAdmin: boolean;
  createdAt: string;
}

export interface StoredProperty {
  id: string;
  userId: string;
  title: string;
  type: 'house' | 'apartment' | 'condo' | 'studio' | 'office' | 'land' | 'other';
  price: number;
  currency: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  description: string;
  images: string[];
  status: 'published' | 'draft' | 'archived';
  createdAt: string;
}

export interface Inquiry {
  id: string;
  listingId: string;
  senderName: string;
  senderEmail: string;
  senderPhone?: string;
  message: string;
  responded: boolean;
  createdAt: string;
}

export const storage = {
  // User methods (mostly handled by AuthContext now, but keeping for compat if needed)
  getUserByEmail: async (email: string) => {
    // This is now handled by Supabase Auth, but we might need to fetch profile
    const { data } = await supabase.from('users').select('*').eq('email', email).single();
    return data;
  },

  // Property methods
  getProperties: async (): Promise<StoredProperty[]> => {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching properties:', error);
      return [];
    }

    return (data || []).map(mapPropertyFromDB);
  },

  getProperty: async (id: string): Promise<StoredProperty | null> => {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return null;
    return mapPropertyFromDB(data);
  },

  getUserProperties: async (userId: string): Promise<StoredProperty[]> => {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) return [];
    return (data || []).map(mapPropertyFromDB);
  },

  addProperty: async (property: Omit<StoredProperty, 'id' | 'createdAt'>) => {
    const { data, error } = await supabase
      .from('properties')
      .insert([{
        user_id: property.userId,
        title: property.title,
        type: property.type,
        price: property.price,
        currency: property.currency,
        address: property.address,
        city: property.city,
        state: property.state,
        zip: property.zip,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        sqft: property.sqft,
        description: property.description,
        images: property.images,
        status: property.status
      }])
      .select()
      .single();

    if (error) throw error;
    return mapPropertyFromDB(data);
  },

  deleteProperty: async (id: string) => {
    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Inquiry methods
  addInquiry: async (inquiry: Omit<Inquiry, 'id' | 'createdAt' | 'responded'>) => {
    const { error } = await supabase
      .from('inquiries')
      .insert([{
        listing_id: inquiry.listingId,
        sender_name: inquiry.senderName,
        sender_email: inquiry.senderEmail,
        sender_phone: inquiry.senderPhone,
        message: inquiry.message
      }]);

    if (error) throw error;
  },

  getListingInquiries: async (listingId: string): Promise<Inquiry[]> => {
    const { data, error } = await supabase
      .from('inquiries')
      .select('*')
      .eq('listing_id', listingId)
      .order('created_at', { ascending: false });

    if (error) return [];
    return (data || []).map(mapInquiryFromDB);
  },

  // Admin methods
  getAllProperties: async (): Promise<StoredProperty[]> => {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) return [];
    return (data || []).map(mapPropertyFromDB);
  },

  updatePropertyStatus: async (id: string, status: 'published' | 'draft' | 'archived') => {
    const { error } = await supabase
      .from('properties')
      .update({ status })
      .eq('id', id);

    if (error) throw error;
  },

  getAllUsers: async (): Promise<User[]> => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) return [];

    return (data || []).map((u: any) => ({
      id: u.id,
      email: u.email,
      name: u.name,
      role: u.role,
      isAdmin: u.role === 'admin',
      createdAt: u.created_at
    }));
  }
};

// Helper to map DB snake_case to frontend camelCase
function mapPropertyFromDB(dbProp: any): StoredProperty {
  return {
    id: dbProp.id,
    userId: dbProp.user_id,
    title: dbProp.title,
    type: dbProp.type,
    price: dbProp.price,
    currency: dbProp.currency || 'NGN',
    address: dbProp.address,
    city: dbProp.city,
    state: dbProp.state,
    zip: dbProp.zip,
    bedrooms: dbProp.bedrooms,
    bathrooms: dbProp.bathrooms,
    sqft: dbProp.sqft,
    description: dbProp.description,
    images: dbProp.images || [],
    status: dbProp.status,
    createdAt: dbProp.created_at
  };
}

function mapInquiryFromDB(dbInq: any): Inquiry {
  return {
    id: dbInq.id,
    listingId: dbInq.listing_id,
    senderName: dbInq.sender_name,
    senderEmail: dbInq.sender_email,
    senderPhone: dbInq.sender_phone,
    message: dbInq.message,
    responded: dbInq.responded || false,
    createdAt: dbInq.created_at
  };
}