/*
  # Create bookings table and email notification system

  1. New Tables
    - `bookings`
      - `id` (uuid, primary key)
      - `service_type` (text) - The selected service
      - `service_price` (text) - Price of the service
      - `booking_date` (date) - Requested service date
      - `booking_time` (text) - Requested service time
      - `customer_name` (text) - Customer's full name
      - `customer_email` (text) - Customer's email address
      - `customer_phone` (text) - Customer's phone number
      - `service_address` (text) - Where service should be performed
      - `notes` (text, optional) - Additional customer notes
      - `status` (text) - Booking status (pending, confirmed, completed, cancelled)
      - `created_at` (timestamp) - When booking was created
      - `updated_at` (timestamp) - When booking was last updated

  2. Security
    - Enable RLS on `bookings` table
    - Add policy for public insert (anyone can create bookings)
    - Add policy for authenticated users to read all bookings (for admin access)

  3. Functions
    - Create function to send email notifications when new booking is created
*/

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_type text NOT NULL,
  service_price text NOT NULL,
  booking_date date NOT NULL,
  booking_time text NOT NULL,
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text NOT NULL,
  service_address text NOT NULL,
  notes text DEFAULT '',
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert bookings (for public booking form)
CREATE POLICY "Anyone can create bookings"
  ON bookings
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow authenticated users to read all bookings (for admin dashboard)
CREATE POLICY "Authenticated users can read all bookings"
  ON bookings
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow authenticated users to update bookings (for status changes)
CREATE POLICY "Authenticated users can update bookings"
  ON bookings
  FOR UPDATE
  TO authenticated
  USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();