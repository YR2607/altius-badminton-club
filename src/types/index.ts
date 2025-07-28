export interface Hall {
  id: number;
  name: string;
  courts_count: number;
  price_per_hour: number;
  description: string;
  detailed_description?: string;
  features: string[];
  images: string[];
  videos?: string[];
  specifications: Record<string, string>;
  amenities: string[];
  working_hours: Record<string, string>;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Booking {
  id: number;
  hall_id: number;
  user_name: string;
  user_email: string;
  user_phone: string;
  date: string;
  time_slot: string;
  court_number: number;
  duration_hours: number;
  total_price: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  created_at: string;
}

export interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  featured_image?: string;
  gallery_images?: string[]; // Additional images for slider
  category: 'post' | 'event';
  status: 'draft' | 'published' | 'archived';
  author_name: string;
  tags?: string[];
  event_date?: string; // ISO string for events
  event_location?: string; // Only for events
  meta_description?: string;
  views_count: number;
  created_at: string;
  updated_at: string;
}

export interface PostFormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image: string;
  gallery_images: string[]; // Additional images for slider
  category: 'post' | 'event';
  status: 'draft' | 'published' | 'archived';
  author_name: string;
  tags: string[];
  event_date?: string;
  event_location?: string;
  meta_description: string;
}
