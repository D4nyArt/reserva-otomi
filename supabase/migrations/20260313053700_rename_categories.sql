-- Rename category "ecoturismo" → "naturaleza"
UPDATE events SET category = 'naturaleza' WHERE category = 'ecoturismo';
UPDATE highlight_cards SET category = 'naturaleza' WHERE category = 'ecoturismo';

-- Reassign category "activismo" → "naturaleza"
UPDATE events SET category = 'naturaleza' WHERE category = 'activismo';
UPDATE highlight_cards SET category = 'naturaleza' WHERE category = 'activismo';
