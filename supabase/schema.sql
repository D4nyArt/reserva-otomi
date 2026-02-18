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
  description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  display_order INT DEFAULT 0,
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

-- ─── Supabase Storage ───
-- NOTE: You must manually create a PUBLIC bucket named "highlight-images"
-- in your Supabase Dashboard → Storage → New Bucket

-- ─── Sample Data: Events ───
INSERT INTO events (title, description, date, category, image_url, tags) VALUES
  ('Senderismo en la Reserva', 'Recorrido guiado por los senderos de la reserva natural, con avistamiento de aves y flora endémica.', '2026-03-15T09:00:00-06:00', 'ecoturismo', NULL, ARRAY['senderismo', 'avistamientos', 'naturaleza']),
  ('Taller de Lengua Otomí', 'Sesión introductoria a la lengua Hñähñu con hablantes nativos de la comunidad.', '2026-03-22T10:00:00-06:00', 'cultura', NULL, ARRAY['lengua', 'otomí', 'comunidad']),
  ('Jornada de Reforestación', 'Actividad comunitaria de plantación de árboles nativos en la zona de amortiguamiento.', '2026-04-05T08:00:00-06:00', 'activismo', NULL, ARRAY['reforestación', 'medio ambiente', 'voluntariado']),
  ('Taller de Medicina Tradicional', 'Conoce las plantas medicinales de la región y sus usos ancestrales.', '2026-04-12T11:00:00-06:00', 'talleres', NULL, ARRAY['medicina', 'herbolaria', 'tradición']);

INSERT INTO testimonials (author, content, event_id) VALUES
  ('María González', 'Una experiencia increíble. Aprendí tanto sobre la flora y fauna de nuestra reserva. ¡Volveré pronto!', (SELECT id FROM events WHERE title = 'Senderismo en la Reserva')),
  ('Carlos Ramírez', 'El taller de lengua Otomí me conectó con mis raíces de una forma que nunca imaginé. Muy recomendado.', (SELECT id FROM events WHERE title = 'Taller de Lengua Otomí')),
  ('Ana Martínez', 'Plantar árboles con la comunidad fue una experiencia transformadora. La organización es excelente.', (SELECT id FROM events WHERE title = 'Jornada de Reforestación'));

-- ─── Sample Data: Highlight Cards ───
INSERT INTO highlight_cards (section, title, description, image_url, display_order) VALUES
  ('raices', 'Lengua Hñähñu', 'Preservamos la lengua Otomí a través de talleres, materiales educativos y programas intergeneracionales.', '/images/lengua.png', 1),
  ('raices', 'Gastronomía Ancestral', 'La cocina Otomí refleja siglos de sabiduría: ingredientes locales, técnicas prehispánicas y sabores únicos.', '/images/gastronomia.png', 2),
  ('raices', 'Medicina Tradicional', 'Herbolaria y conocimientos medicinales transmitidos de generación en generación para el bienestar comunitario.', '/images/medicina.png', 3),
  ('preservacion', 'Biodiversidad: Hongos', 'Documentamos y protegemos la extraordinaria diversidad de hongos del bosque de niebla.', '/images/hongos.png', 1),
  ('preservacion', 'Reforestación', 'Programas activos de reforestación con árboles nativos para restaurar los ecosistemas.', '/images/reforestacion.png', 2),
  ('preservacion', 'Conservación del Agua', 'Protegemos los manantiales, ríos y el embalse natural que abastecen a toda la región.', '/images/agua.png', 3);
