import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Check if Supabase is properly configured
const isSupabaseConfigured =
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.includes('supabase.co') &&
  supabaseAnonKey.length > 100; // JWT tokens are long

// Log configuration status for debugging
console.log('Supabase Configuration:', {
  url: supabaseUrl ? `${supabaseUrl.substring(0, 30)}...` : 'NOT SET',
  keyLength: supabaseAnonKey.length,
  isConfigured: isSupabaseConfigured
});

// Always use the provided values, even if they might be invalid
// This way we get proper error messages instead of dummy URLs
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);

// Helper function to check if Supabase is available
export const isSupabaseAvailable = () => isSupabaseConfigured;

// Database types
export interface Booking {
  id: string;
  name: string;
  phone: string;
  email?: string;
  hall_id: number;
  court: number;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface Hall {
  id: number;
  name: string;
  courts_count: number;
  price_per_hour: number;
  description: string;
  features: string[];
  created_at: string;
}

// Booking functions
export const bookingService = {
  // Get all bookings
  async getBookings() {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('date', { ascending: true });
    
    if (error) throw error;
    return data;
  },

  // Get bookings for a specific date and hall
  async getBookingsByDateAndHall(date: string, hallId?: number) {
    let query = supabase
      .from('bookings')
      .select('*')
      .eq('date', date);
    
    if (hallId) {
      query = query.eq('hall_id', hallId);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  // Create a new booking
  async createBooking(booking: Omit<Booking, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('bookings')
      .insert([booking])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Update booking status
  async updateBookingStatus(id: string, status: 'pending' | 'confirmed' | 'cancelled') {
    const { data, error } = await supabase
      .from('bookings')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Delete a booking
  async deleteBooking(id: string) {
    const { error } = await supabase
      .from('bookings')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // Check if a slot is available
  async isSlotAvailable(hallId: number, court: number, date: string, time: string) {
    const { data, error } = await supabase
      .from('bookings')
      .select('id')
      .eq('hall_id', hallId)
      .eq('court', court)
      .eq('date', date)
      .eq('time', time)
      .neq('status', 'cancelled');
    
    if (error) throw error;
    return data.length === 0;
  }
};

// Hall functions
export const hallService = {
  // Get all halls
  async getHalls() {
    const { data, error } = await supabase
      .from('halls')
      .select('*')
      .order('id', { ascending: true });
    
    if (error) throw error;
    return data;
  },

  // Get a specific hall
  async getHall(id: number) {
    const { data, error } = await supabase
      .from('halls')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }
};
