-- Create storage bucket for PACS images
insert into storage.buckets (id, name, public)
values ('pacs-images', 'pacs-images', true)
on conflict (id) do nothing;

-- Set up storage policies to allow authenticated uploads
create policy "Allow authenticated uploads to pacs-images"
on storage.objects for insert
to authenticated
with check (bucket_id = 'pacs-images');

create policy "Allow public read access to pacs-images"
on storage.objects for select
to public
using (bucket_id = 'pacs-images');

create policy "Allow authenticated users to update their uploads"
on storage.objects for update
to authenticated
using (bucket_id = 'pacs-images');

create policy "Allow authenticated users to delete their uploads"
on storage.objects for delete
to authenticated
using (bucket_id = 'pacs-images');
