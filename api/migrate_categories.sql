-- Migration: Update categories from old ENUM to VARCHAR for flexibility
-- Import into the database you have selected in phpMyAdmin (removed explicit USE)

-- Change hardware_category from ENUM to VARCHAR in tickets table
ALTER TABLE tickets MODIFY COLUMN hardware_category VARCHAR(80) NOT NULL;

-- Change hardware_category from ENUM to VARCHAR in archives table
ALTER TABLE archives MODIFY COLUMN hardware_category VARCHAR(80) NOT NULL;

-- Add an index on brand+model for suggestions
ALTER TABLE tickets ADD INDEX idx_brand_model (hardware_category, brand, model);
