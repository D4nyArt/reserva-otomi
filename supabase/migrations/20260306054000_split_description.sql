ALTER TABLE highlight_cards RENAME COLUMN description TO short_description;
ALTER TABLE highlight_cards ADD COLUMN long_description TEXT NOT NULL DEFAULT '';
