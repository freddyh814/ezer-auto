CREATE TYPE staff_role AS ENUM ('admin', 'manager', 'sales');

CREATE TABLE staff_profiles (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  name       TEXT NOT NULL,
  role       staff_role NOT NULL DEFAULT 'sales',
  is_active  BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE staff_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "staff_read_own"
  ON staff_profiles
  FOR SELECT
  USING (auth.uid() = user_id);
