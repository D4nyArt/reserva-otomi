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

-- ─── Indexes ───
CREATE INDEX idx_events_date ON events(date);
CREATE INDEX idx_events_category ON events(category);
CREATE INDEX idx_testimonials_event ON testimonials(event_id);

-- ─── Row Level Security ───
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Public read access policies
CREATE POLICY "Allow public read on events"
  ON events FOR SELECT
  USING (true);

CREATE POLICY "Allow public read on testimonials"
  ON testimonials FOR SELECT
  USING (true);

-- ─── Sample Data ───
INSERT INTO events (title, description, date, category, image_url, tags) VALUES
  ('Senderismo en la Reserva', 'Recorrido guiado por los senderos de la reserva natural, con avistamiento de aves y flora endémica.', '2026-03-15T09:00:00-06:00', 'ecoturismo', NULL, ARRAY['senderismo', 'avistamientos', 'naturaleza']),
  ('Taller de Lengua Otomí', 'Sesión introductoria a la lengua Hñähñu con hablantes nativos de la comunidad.', '2026-03-22T10:00:00-06:00', 'cultura', NULL, ARRAY['lengua', 'otomí', 'comunidad']),
  ('Jornada de Reforestación', 'Actividad comunitaria de plantación de árboles nativos en la zona de amortiguamiento.', '2026-04-05T08:00:00-06:00', 'activismo', NULL, ARRAY['reforestación', 'medio ambiente', 'voluntariado']),
  ('Taller de Medicina Tradicional', 'Conoce las plantas medicinales de la región y sus usos ancestrales.', '2026-04-12T11:00:00-06:00', 'talleres', NULL, ARRAY['medicina', 'herbolaria', 'tradición']);

INSERT INTO testimonials (author, content, event_id) VALUES
  ('María González', 'Una experiencia increíble. Aprendí tanto sobre la flora y fauna de nuestra reserva. ¡Volveré pronto!', (SELECT id FROM events WHERE title = 'Senderismo en la Reserva')),
  ('Carlos Ramírez', 'El taller de lengua Otomí me conectó con mis raíces de una forma que nunca imaginé. Muy recomendado.', (SELECT id FROM events WHERE title = 'Taller de Lengua Otomí')),
  ('Ana Martínez', 'Plantar árboles con la comunidad fue una experiencia transformadora. La organización es excelente.', (SELECT id FROM events WHERE title = 'Jornada de Reforestación'));
