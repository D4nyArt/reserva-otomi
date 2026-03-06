ALTER TABLE events ADD COLUMN registration_link TEXT;

ALTER TABLE events
ADD CONSTRAINT registration_link_valid
CHECK (
  registration_link IS NULL
  OR registration_link = ''
  OR registration_link ~* '^(https?://).+'
);