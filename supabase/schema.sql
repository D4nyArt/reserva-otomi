-- ============================================
-- Agua Barranca — Supabase Database Schema
-- ============================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── Events Table ───
CREATE TABLE events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  date TIMESTAMPTZ NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('ecoturismo', 'cultura', 'talleres', 'activismo')),
  image_url TEXT,
  registration_link TEXT, -- opcional URL para el registro
  CONSTRAINT registration_link_valid CHECK (
      registration_link IS NULL OR registration_link = '' OR registration_link ~* '^(https?://).+'
  ),
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── Testimonials Table ───
CREATE TABLE testimonials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  author TEXT NOT NULL,
  content TEXT NOT NULL,
  event_id UUID REFERENCES events(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── Highlight Cards Table ───
CREATE TABLE highlight_cards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  section TEXT NOT NULL CHECK (section IN ('raices', 'preservacion')),
  title TEXT NOT NULL,
  short_description TEXT NOT NULL,
  long_description TEXT NOT NULL DEFAULT '',
  image_url TEXT NOT NULL,
  display_order INT DEFAULT 0,
  category TEXT DEFAULT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── Indexes ───
CREATE INDEX idx_events_date ON events(date);
CREATE INDEX idx_events_category ON events(category);
CREATE INDEX idx_testimonials_event ON testimonials(event_id);
CREATE INDEX idx_highlight_cards_section ON highlight_cards(section);

-- ─── Row Level Security ───
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE highlight_cards ENABLE ROW LEVEL SECURITY;

-- Public read access policies
CREATE POLICY "Allow public read on events"
  ON events FOR SELECT
  USING (true);

CREATE POLICY "Allow public read on testimonials"
  ON testimonials FOR SELECT
  USING (true);

CREATE POLICY "Allow public read on highlight_cards"
  ON highlight_cards FOR SELECT
  USING (true);

-- Authenticated write access for highlight_cards (admin)
CREATE POLICY "Allow authenticated insert on highlight_cards"
  ON highlight_cards FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow authenticated delete on highlight_cards"
  ON highlight_cards FOR DELETE
  USING (true);

CREATE POLICY "Allow authenticated update on highlight_cards"
  ON highlight_cards FOR UPDATE
  USING (true);

-- Write access for events (admin)
CREATE POLICY "Allow insert on events"
  ON events FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow delete on events"
  ON events FOR DELETE
  USING (true);

CREATE POLICY "Allow update on events"
  ON events FOR UPDATE
  USING (true);

-- ─── Supabase Storage ───
-- NOTE: You must manually create a PUBLIC bucket named "highlight-images"
-- in your Supabase Dashboard → Storage → New Bucket

-- ─── Sample Data: Events ───
INSERT INTO events (title, description, date, category, image_url, registration_link, tags) VALUES
  ('Senderismo en la Reserva', 'Recorrido guiado por los senderos de la reserva natural, con avistamiento de aves y flora endémica.', '2026-03-15T09:00:00-06:00', 'ecoturismo', NULL, 'https://example.com/register-senderismo', ARRAY['senderismo', 'avistamientos', 'naturaleza']),
  ('Taller de Lengua Otomí', 'Sesión introductoria a la lengua Hñähñu con hablantes nativos de la comunidad.', '2026-03-22T10:00:00-06:00', 'cultura', NULL, NULL, ARRAY['lengua', 'otomí', 'comunidad']),
  ('Jornada de Reforestación', 'Actividad comunitaria de plantación de árboles nativos en la zona de amortiguamiento.', '2026-04-05T08:00:00-06:00', 'activismo', NULL, 'https://example.com/register-reforestacion', ARRAY['reforestación', 'medio ambiente', 'voluntariado']),
  ('Taller de Medicina Tradicional', 'Conoce las plantas medicinales de la región y sus usos ancestrales.', '2026-04-12T11:00:00-06:00', 'talleres', NULL, NULL, ARRAY['medicina', 'herbolaria', 'tradición']);

INSERT INTO testimonials (author, content, event_id) VALUES
  ('María González', 'Una experiencia increíble. Aprendí tanto sobre la flora y fauna de nuestra reserva. ¡Volveré pronto!', (SELECT id FROM events WHERE title = 'Senderismo en la Reserva')),
  ('Carlos Ramírez', 'El taller de lengua Otomí me conectó con mis raíces de una forma que nunca imaginé. Muy recomendado.', (SELECT id FROM events WHERE title = 'Taller de Lengua Otomí')),
  ('Ana Martínez', 'Plantar árboles con la comunidad fue una experiencia transformadora. La organización es excelente.', (SELECT id FROM events WHERE title = 'Jornada de Reforestación'));

-- ─── Sample Data: Highlight Cards ───
INSERT INTO highlight_cards (section, title, short_description, image_url, display_order) VALUES
  ('raices', 'Lengua Hñähñu', 'Preservamos la lengua Otomí a través de talleres, materiales educativos y programas intergeneracionales.', '/images/lengua.png', 1),
  ('raices', 'Gastronomía Ancestral', 'La cocina Otomí refleja siglos de sabiduría: ingredientes locales, técnicas prehispánicas y sabores únicos.', '/images/gastronomia.png', 2),
  ('raices', 'Medicina Tradicional', 'Herbolaria y conocimientos medicinales transmitidos de generación en generación para el bienestar comunitario.', '/images/medicina.png', 3),
  ('preservacion', 'Biodiversidad: Hongos', 'Documentamos y protegemos la extraordinaria diversidad de hongos del bosque de niebla.', '/images/hongos.png', 1),
  ('preservacion', 'Reforestación', 'Programas activos de reforestación con árboles nativos para restaurar los ecosistemas.', '/images/reforestacion.png', 2),
  ('preservacion', 'Conservación del Agua', 'Protegemos los manantiales, ríos y el embalse natural que abastecen a toda la región.', '/images/agua.png', 3);

-- ═══════════════════════════════════════════
-- Otomi Learning Tool — Scenarios & Elements
-- ═══════════════════════════════════════════

-- ─── Otomi Scenarios Table ───
CREATE TABLE otomi_scenarios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  bg_gradient TEXT NOT NULL DEFAULT 'linear-gradient(180deg, #87CEEB 0%, #F5DEB3 60%, #8B7355 100%)',
  bg_image_url TEXT,
  bg_emoji TEXT DEFAULT '🌿',
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── Otomi Elements Table ───
CREATE TABLE otomi_elements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  scenario_id UUID NOT NULL REFERENCES otomi_scenarios(id) ON DELETE CASCADE,
  otomi_word TEXT NOT NULL,
  spanish_word TEXT NOT NULL,
  image_url TEXT,
  emoji TEXT DEFAULT '❓',
  position_x INT NOT NULL DEFAULT 50,
  position_y INT NOT NULL DEFAULT 50,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── Indexes ───
CREATE INDEX idx_otomi_scenarios_order ON otomi_scenarios(display_order);
CREATE INDEX idx_otomi_elements_scenario ON otomi_elements(scenario_id);

-- ─── RLS ───
ALTER TABLE otomi_scenarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE otomi_elements ENABLE ROW LEVEL SECURITY;

-- Public read
CREATE POLICY "Allow public read on otomi_scenarios"
  ON otomi_scenarios FOR SELECT USING (true);
CREATE POLICY "Allow public read on otomi_elements"
  ON otomi_elements FOR SELECT USING (true);

-- Write access
CREATE POLICY "Allow insert on otomi_scenarios"
  ON otomi_scenarios FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update on otomi_scenarios"
  ON otomi_scenarios FOR UPDATE USING (true);
CREATE POLICY "Allow delete on otomi_scenarios"
  ON otomi_scenarios FOR DELETE USING (true);

CREATE POLICY "Allow insert on otomi_elements"
  ON otomi_elements FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update on otomi_elements"
  ON otomi_elements FOR UPDATE USING (true);
CREATE POLICY "Allow delete on otomi_elements"
  ON otomi_elements FOR DELETE USING (true);
