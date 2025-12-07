-- Add header_background_url column to pacs table
ALTER TABLE pacs 
ADD COLUMN IF NOT EXISTS header_background_url TEXT;

-- Add comment
COMMENT ON COLUMN pacs.header_background_url IS 'URL for the landing page header background image';
