-- Migration: Update education field - simplify to single object
-- Description: 
-- 1. Education field simplified (removed gpa and description)
-- 2. Education changed from array to single object

-- Note: This migration will keep the existing education data structure in JSON
-- The application code will handle both old format (array) and new format (object)
-- Existing data will continue to work, new data will use simplified single object format

-- No database structure changes needed as education is stored as JSON string
-- The migration is handled at the application level

-- To manually update existing records to new format (optional):
-- UPDATE Profile SET education = json_extract(education, '$[0]') WHERE education IS NOT NULL AND education != '[]';
