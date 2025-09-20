/*
  # Fix Row-Level Security for bookings table

  1. Security Updates
    - Update RLS policy to allow anonymous users to insert bookings
    - Keep existing policies for authenticated users to read and update
    - Ensure public can create bookings without authentication

  2. Changes
    - Drop existing restrictive INSERT policy
    - Create new policy allowing anonymous bookings
    - Maintain security for read/update operations
*/

-- Drop the existing restrictive policy if it exists
DROP POLICY IF EXISTS "Anyone can create bookings" ON bookings;

-- Create a new policy that allows anonymous users to insert bookings
CREATE POLICY "Allow anonymous booking creation"
  ON bookings
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Ensure the existing policies for reading and updating are correct
DROP POLICY IF EXISTS "Authenticated users can read all bookings" ON bookings;
CREATE POLICY "Authenticated users can read all bookings"
  ON bookings
  FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Authenticated users can update bookings" ON bookings;
CREATE POLICY "Authenticated users can update bookings"
  ON bookings
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);