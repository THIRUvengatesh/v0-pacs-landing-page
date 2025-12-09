-- Create table for loan application steps
CREATE TABLE IF NOT EXISTS pacs_loan_application_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  loan_scheme_id UUID NOT NULL REFERENCES pacs_loan_schemes(id) ON DELETE CASCADE,
  step_number INTEGER NOT NULL,
  step_title TEXT NOT NULL,
  step_description TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(loan_scheme_id, step_number)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_loan_steps_scheme_id ON pacs_loan_application_steps(loan_scheme_id);

-- Add comment
COMMENT ON TABLE pacs_loan_application_steps IS 'Stores step-by-step procedures for loan applications';

-- Disable RLS for admin management
ALTER TABLE pacs_loan_application_steps DISABLE ROW LEVEL SECURITY;
