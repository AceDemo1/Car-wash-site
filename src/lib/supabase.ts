import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please connect to Supabase first.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      bookings: {
        Row: {
          id: string;
          service_type: string;
          service_price: string;
          booking_date: string;
          booking_time: string;
          customer_name: string;
          customer_email: string;
          customer_phone: string;
          service_address: string;
          notes: string;
          status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          service_type: string;
          service_price: string;
          booking_date: string;
          booking_time: string;
          customer_name: string;
          customer_email: string;
          customer_phone: string;
          service_address: string;
          notes?: string;
          status?: 'pending' | 'confirmed' | 'completed' | 'cancelled';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          service_type?: string;
          service_price?: string;
          booking_date?: string;
          booking_time?: string;
          customer_name?: string;
          customer_email?: string;
          customer_phone?: string;
          service_address?: string;
          notes?: string;
          status?: 'pending' | 'confirmed' | 'completed' | 'cancelled';
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};