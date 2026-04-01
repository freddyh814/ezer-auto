-- supabase/migrations/003_staff_rls_write.sql
-- Explicitly restrict direct writes to staff_profiles via the anon/authenticated role.
-- All writes must go through the service-role client (which bypasses RLS).
CREATE POLICY "staff_no_direct_insert"
  ON staff_profiles
  FOR INSERT
  WITH CHECK (false);

CREATE POLICY "staff_no_direct_update"
  ON staff_profiles
  FOR UPDATE
  USING (false);

CREATE POLICY "staff_no_direct_delete"
  ON staff_profiles
  FOR DELETE
  USING (false);
