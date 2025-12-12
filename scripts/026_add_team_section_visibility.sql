-- Add visibility control for the "Our Team" section
ALTER TABLE pacs 
ADD COLUMN IF NOT EXISTS show_team_section BOOLEAN DEFAULT true;

-- Update existing records to show team section by default
UPDATE pacs SET show_team_section = true WHERE show_team_section IS NULL;
