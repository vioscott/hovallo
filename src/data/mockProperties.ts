export interface Property {
  id: string;
  title: string;
  type: 'house' | 'apartment' | 'condo' | 'studio';
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  description: string;
  image: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  featured?: boolean;
}
export const mockProperties: Property[] = [{
  id: '1',
  title: 'Modern Downtown Apartment',
  type: 'apartment',
  price: 2400,
  location: 'Downtown, Seattle',
  bedrooms: 2,
  bathrooms: 2,
  sqft: 1200,
  description: 'Beautiful modern apartment in the heart of downtown. Walking distance to shops, restaurants, and public transit. Features include hardwood floors, stainless steel appliances, and in-unit laundry.',
  image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80',
  contactName: 'Sarah Johnson',
  contactEmail: 'sarah@example.com',
  contactPhone: '(555) 123-4567',
  featured: true
}, {
  id: '2',
  title: 'Spacious Family Home',
  type: 'house',
  price: 3200,
  location: 'Maple Grove',
  bedrooms: 4,
  bathrooms: 3,
  sqft: 2400,
  description: 'Charming family home with large backyard. Perfect for families with children. Updated kitchen, finished basement, and attached two-car garage.',
  image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80',
  contactName: 'Mike Chen',
  contactEmail: 'mike@example.com',
  contactPhone: '(555) 234-5678',
  featured: true
}, {
  id: '3',
  title: 'Cozy Studio Loft',
  type: 'studio',
  price: 1400,
  location: 'Capitol Hill',
  bedrooms: 0,
  bathrooms: 1,
  sqft: 550,
  description: 'Charming studio with high ceilings and exposed brick. Great natural light and close to cafes and nightlife.',
  image: 'https://images.unsplash.com/photo-1502672260066-6bc2c7d89c0e?w=800&q=80',
  contactName: 'Emma Davis',
  contactEmail: 'emma@example.com',
  contactPhone: '(555) 345-6789',
  featured: true
}, {
  id: '4',
  title: 'Luxury Waterfront Condo',
  type: 'condo',
  price: 4500,
  location: 'Waterfront District',
  bedrooms: 3,
  bathrooms: 2.5,
  sqft: 1800,
  description: 'Stunning waterfront views from every room. Premium finishes, floor-to-ceiling windows, and access to building amenities including gym and rooftop deck.',
  image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80',
  contactName: 'David Park',
  contactEmail: 'david@example.com',
  contactPhone: '(555) 456-7890'
}, {
  id: '5',
  title: 'Garden Apartment',
  type: 'apartment',
  price: 1900,
  location: 'Fremont',
  bedrooms: 1,
  bathrooms: 1,
  sqft: 750,
  description: 'Ground floor apartment with private patio and garden access. Quiet neighborhood with street parking.',
  image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
  contactName: 'Lisa Wong',
  contactEmail: 'lisa@example.com',
  contactPhone: '(555) 567-8901'
}, {
  id: '6',
  title: 'Renovated Townhouse',
  type: 'house',
  price: 2800,
  location: 'Queen Anne',
  bedrooms: 3,
  bathrooms: 2.5,
  sqft: 1600,
  description: 'Recently renovated townhouse with modern finishes. Open concept living, private rooftop deck, and one-car garage.',
  image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
  contactName: 'James Miller',
  contactEmail: 'james@example.com',
  contactPhone: '(555) 678-9012'
}];