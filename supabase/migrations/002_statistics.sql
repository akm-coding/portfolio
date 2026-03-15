-- Statistics table for animated counter section
-- Run via Supabase dashboard SQL Editor or: supabase db push

CREATE TABLE statistics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label TEXT NOT NULL,
  value INT NOT NULL,
  suffix TEXT,
  icon_name TEXT NOT NULL DEFAULT 'hash',
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE statistics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read access" ON statistics FOR SELECT USING (true);
CREATE POLICY "Authenticated insert" ON statistics FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated update" ON statistics FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated delete" ON statistics FOR DELETE TO authenticated USING (true);

-- Seed data
INSERT INTO statistics (label, value, suffix, icon_name, display_order) VALUES
  ('Years of Experience', 4, '+', 'calendar', 0),
  ('Projects Completed', 20, '+', 'folder-kanban', 1),
  ('Technologies Used', 15, '+', 'code', 2),
  ('Companies Worked At', 4, NULL, 'briefcase', 3);
