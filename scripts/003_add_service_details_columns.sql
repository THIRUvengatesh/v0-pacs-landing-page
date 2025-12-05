-- Add detailed fields to pacs_services table for comprehensive service information
ALTER TABLE pacs_services 
ADD COLUMN IF NOT EXISTS detailed_description TEXT,
ADD COLUMN IF NOT EXISTS benefits TEXT[],
ADD COLUMN IF NOT EXISTS eligibility TEXT,
ADD COLUMN IF NOT EXISTS required_documents TEXT[],
ADD COLUMN IF NOT EXISTS process_steps TEXT[],
ADD COLUMN IF NOT EXISTS fees TEXT,
ADD COLUMN IF NOT EXISTS contact_person TEXT,
ADD COLUMN IF NOT EXISTS contact_phone TEXT;

-- Add comment to the table
COMMENT ON TABLE pacs_services IS 'Stores detailed information about services offered by PACS including benefits, eligibility, and process steps';
