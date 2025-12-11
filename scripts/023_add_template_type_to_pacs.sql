-- Add template_type column to pacs table
ALTER TABLE pacs ADD COLUMN IF NOT EXISTS template_type INTEGER DEFAULT 1;

-- Add comment
COMMENT ON COLUMN pacs.template_type IS 'Template style: 1 = Template 1 (default), 2 = Template 2';

-- Update existing records to use template 1
UPDATE pacs SET template_type = 1 WHERE template_type IS NULL;
