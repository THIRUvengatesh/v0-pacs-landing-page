-- Create the "uploads" storage bucket for PACS images
-- This bucket will store all uploaded images including gallery and header backgrounds

-- Note: This SQL is for documentation purposes
-- The actual bucket creation is handled by the upload API route
-- which uses the Supabase service role key

-- If you need to create the bucket manually via SQL, you can use:
-- SELECT storage.create_bucket('uploads', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'image/gif']);

-- Set bucket to public access
-- UPDATE storage.buckets SET public = true WHERE name = 'uploads';

-- Create policy to allow public read access
-- This allows anyone to view uploaded images on the landing pages
CREATE POLICY IF NOT EXISTS "Public read access for uploads"
ON storage.objects FOR SELECT
USING (bucket_id = 'uploads');

-- Create policy to allow authenticated uploads
-- This allows logged-in admins to upload images
CREATE POLICY IF NOT EXISTS "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'uploads');

-- Create policy to allow authenticated users to update their own uploads
CREATE POLICY IF NOT EXISTS "Authenticated users can update uploads"
ON storage.objects FOR UPDATE
USING (bucket_id = 'uploads')
WITH CHECK (bucket_id = 'uploads');

-- Create policy to allow authenticated users to delete uploads
CREATE POLICY IF NOT EXISTS "Authenticated users can delete uploads"
ON storage.objects FOR DELETE
USING (bucket_id = 'uploads');
