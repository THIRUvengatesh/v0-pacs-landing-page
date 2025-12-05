-- Add is_visible column to pacs_services table to control landing page display
ALTER TABLE pacs_services
ADD COLUMN IF NOT EXISTS is_visible BOOLEAN DEFAULT true;

-- Update existing services to be visible by default
UPDATE pacs_services
SET is_visible = true
WHERE is_visible IS NULL;

-- Add comment
COMMENT ON COLUMN pacs_services.is_visible IS 'Controls whether service is displayed on public landing page';
