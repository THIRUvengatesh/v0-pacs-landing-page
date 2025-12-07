-- Verify and fix pacs_gallery table permissions
-- This script ensures the pacs_gallery table can be accessed properly

-- Check if RLS is correctly disabled (we disabled it in script 016)
-- If for some reason it got re-enabled, disable it
ALTER TABLE pacs_gallery DISABLE ROW LEVEL SECURITY;

-- Verify the table structure
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM 
    information_schema.columns
WHERE 
    table_schema = 'public' 
    AND table_name = 'pacs_gallery'
ORDER BY 
    ordinal_position;

-- Test insert to ensure it works (will be rolled back)
DO $$
DECLARE
    test_pacs_id uuid;
    test_result uuid;
BEGIN
    -- Get a random PACS ID for testing
    SELECT id INTO test_pacs_id FROM pacs LIMIT 1;
    
    IF test_pacs_id IS NOT NULL THEN
        -- Try to insert a test record
        INSERT INTO pacs_gallery (pacs_id, image_url, caption, display_order)
        VALUES (test_pacs_id, 'https://test.com/image.jpg', 'Test caption', 1)
        RETURNING id INTO test_result;
        
        -- Delete the test record immediately
        DELETE FROM pacs_gallery WHERE id = test_result;
        
        RAISE NOTICE 'Gallery table permissions OK - test insert successful';
    ELSE
        RAISE NOTICE 'No PACS found for testing';
    END IF;
END $$;
