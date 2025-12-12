-- Add is_leadership flag to pacs_team_members table to distinguish leadership roles
ALTER TABLE pacs_team_members
ADD COLUMN IF NOT EXISTS is_leadership BOOLEAN DEFAULT false;

-- Add display priority for sorting (leadership members show first)
ALTER TABLE pacs_team_members
ADD COLUMN IF NOT EXISTS display_priority INTEGER DEFAULT 100;

-- Update existing leadership members if they were already migrated
UPDATE pacs_team_members
SET is_leadership = true,
    display_priority = 10
WHERE position IN ('President', 'Secretary', 'Manager');

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_pacs_team_members_is_leadership 
ON pacs_team_members(pacs_id, is_leadership, display_priority);

COMMENT ON COLUMN pacs_team_members.is_leadership IS 'Indicates if this member is part of core leadership team';
COMMENT ON COLUMN pacs_team_members.display_priority IS 'Lower numbers display first (e.g., 10 for leadership, 100 for other members)';
