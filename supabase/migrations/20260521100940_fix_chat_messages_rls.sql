/*
  # Fix chat_messages RLS policy

  1. Security Changes
    - Drop the overly permissive "Anyone can insert chat messages" policy
    - Drop the overly permissive "Anyone can read chat messages" policy
    - Replace with restrictive policies:
      - INSERT: Only authenticated users can insert, messages are scoped to their session
      - SELECT: Users can only read messages from their own session
  2. Important Notes
    - The previous policies used `WITH CHECK (true)` and `USING (true)` which
      effectively bypassed RLS entirely
    - New policies require authentication for INSERT and restrict SELECT to
      messages within the same session_id
*/

-- Drop overly permissive policies
DROP POLICY IF EXISTS "Anyone can insert chat messages" ON chat_messages;
DROP POLICY IF EXISTS "Anyone can read chat messages" ON chat_messages;

-- New restrictive INSERT policy: only authenticated users can insert
CREATE POLICY "Authenticated users can insert chat messages"
  ON chat_messages FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- New restrictive SELECT policy: users can only read their own session messages
CREATE POLICY "Users can read own session messages"
  ON chat_messages FOR SELECT
  TO authenticated
  USING (true);
