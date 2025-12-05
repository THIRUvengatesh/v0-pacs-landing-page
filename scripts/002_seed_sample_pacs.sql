-- Insert sample PACS data for demonstration
INSERT INTO pacs (
  slug,
  name,
  district,
  state,
  description,
  address,
  phone,
  email,
  map_url,
  latitude,
  longitude,
  cover_image_url,
  president_name,
  president_contact,
  secretary_name,
  secretary_contact,
  manager_name,
  manager_contact,
  established_year,
  member_count,
  about_history,
  about_services,
  about_impact
) VALUES 
(
  'rajnagar-pacs',
  'Rajnagar Primary Agricultural Cooperative Society',
  'Bidar',
  'Karnataka',
  'A trusted Primary Agricultural Cooperative Society serving local farmers with essential services and financial support.',
  'Main Road, Rajnagar Village, Bidar District, Karnataka - 585401',
  '+91 8234567890',
  'rajnagar.pacs@example.com',
  'https://maps.google.com/?q=17.9139,77.5200',
  17.9139,
  77.5200,
  '/placeholder.svg?height=400&width=1200',
  'Rajesh Kumar Patil',
  '+91 9876543210',
  'Suresh Reddy',
  '+91 9876543211',
  'Prakash Rao',
  '+91 9876543212',
  1985,
  450,
  'Established in 1985, Rajnagar PACS has been a cornerstone of agricultural development in the region for nearly four decades. Founded by a group of visionary farmers, our cooperative has grown from serving 50 members to over 450 farming families today.',
  'We provide comprehensive agricultural support including credit facilities, input supply, equipment rental, and marketing assistance. Our services are designed to empower farmers and enhance agricultural productivity in the region.',
  'Over the years, we have disbursed over ₹50 crores in agricultural loans, supplied quality inputs to thousands of farmers, and helped increase crop yields by an average of 30%. We are committed to the prosperity of our farming community.'
),
(
  'basavakalyan-pacs',
  'Basavakalyan Farmers Cooperative Society',
  'Bidar',
  'Karnataka',
  'A trusted Primary Agricultural Cooperative Society serving local farmers with essential services and financial support.',
  'Station Road, Basavakalyan, Bidar District, Karnataka - 585327',
  '+91 8234567891',
  'basavakalyan.pacs@example.com',
  'https://maps.google.com/?q=17.8765,76.9500',
  17.8765,
  76.9500,
  '/placeholder.svg?height=400&width=1200',
  'Mallikarjun Naik',
  '+91 9876543213',
  'Sangappa Swamy',
  '+91 9876543214',
  'Venkatesh Rao',
  '+91 9876543215',
  1978,
  580,
  'Founded in 1978, Basavakalyan Farmers Cooperative Society has been instrumental in transforming agriculture in the region. Our legacy spans over 45 years of dedicated service to the farming community.',
  'We offer a complete range of agricultural services including short-term and long-term credit, quality seed and fertilizer supply, modern farm equipment rental, and direct procurement facilities for produce.',
  'Our cooperative has supported the livelihood of thousands of farmers, facilitated agricultural modernization, and contributed significantly to rural economic development in Basavakalyan taluk.'
);

-- Insert services for Rajnagar PACS
INSERT INTO pacs_services (pacs_id, service_name, service_description, icon_name)
SELECT 
  id,
  service_name,
  service_description,
  icon_name
FROM pacs, (VALUES
  ('Agricultural Loans', 'Short-term and long-term credit facilities for farming activities with competitive interest rates', 'Banknote'),
  ('Fertilizer & Seed Supply', 'Quality certified seeds, fertilizers, and pesticides at subsidized rates', 'Sprout'),
  ('Tractor Rental', 'Modern tractors and farm equipment available for rent on hourly/daily basis', 'Truck'),
  ('Savings & Deposits', 'Safe and secure savings schemes with attractive interest rates for members', 'PiggyBank'),
  ('Procurement Services', 'Direct procurement of agricultural produce at fair market prices', 'ShoppingCart')
) AS services(service_name, service_description, icon_name)
WHERE slug = 'rajnagar-pacs';

-- Insert services for Basavakalyan PACS
INSERT INTO pacs_services (pacs_id, service_name, service_description, icon_name)
SELECT 
  id,
  service_name,
  service_description,
  icon_name
FROM pacs, (VALUES
  ('Agricultural Loans', 'Flexible credit options for all farming needs including crop loans and term loans', 'Banknote'),
  ('Fertilizer & Seed Supply', 'Comprehensive supply of agricultural inputs with technical guidance', 'Sprout'),
  ('Tractor Rental', 'Well-maintained farm machinery available for all agricultural operations', 'Truck'),
  ('Savings & Deposits', 'Multiple savings schemes designed for rural families and farmers', 'PiggyBank'),
  ('Procurement Services', 'Guaranteed purchase of agricultural produce with timely payments', 'ShoppingCart')
) AS services(service_name, service_description, icon_name)
WHERE slug = 'basavakalyan-pacs';

-- Insert machinery for Rajnagar PACS
INSERT INTO pacs_machinery (pacs_id, machinery_name, rent_per_hour, rent_per_day, contact_person, contact_phone)
SELECT 
  id,
  machinery_name,
  rent_per_hour,
  rent_per_day,
  contact_person,
  contact_phone
FROM pacs, (VALUES
  ('Mahindra 575 DI Tractor', 350.00, 2500.00, 'Ramesh Kumar', '+91 9876543220'),
  ('John Deere 5050D Tractor', 400.00, 3000.00, 'Venkatesh Patil', '+91 9876543221'),
  ('Rotavator', 200.00, 1500.00, 'Suresh Naik', '+91 9876543222'),
  ('Seed Drill', 150.00, 1000.00, 'Prakash Reddy', '+91 9876543223'),
  ('Sprayer (Tractor Mounted)', 100.00, 700.00, 'Ramesh Kumar', '+91 9876543220')
) AS machinery(machinery_name, rent_per_hour, rent_per_day, contact_person, contact_phone)
WHERE slug = 'rajnagar-pacs';

-- Insert machinery for Basavakalyan PACS
INSERT INTO pacs_machinery (pacs_id, machinery_name, rent_per_hour, rent_per_day, contact_person, contact_phone)
SELECT 
  id,
  machinery_name,
  rent_per_hour,
  rent_per_day,
  contact_person,
  contact_phone
FROM pacs, (VALUES
  ('Swaraj 855 FE Tractor', 380.00, 2800.00, 'Hanumantha Rao', '+91 9876543224'),
  ('New Holland 3630 TX Tractor', 420.00, 3200.00, 'Basavaraj Swamy', '+91 9876543225'),
  ('Cultivator', 180.00, 1300.00, 'Mahadev Naik', '+91 9876543226'),
  ('Thresher', 250.00, 1800.00, 'Shankar Reddy', '+91 9876543227')
) AS machinery(machinery_name, rent_per_hour, rent_per_day, contact_person, contact_phone)
WHERE slug = 'basavakalyan-pacs';

-- Insert gallery images for Rajnagar PACS
INSERT INTO pacs_gallery (pacs_id, image_url, caption, display_order)
SELECT 
  id,
  image_url,
  caption,
  display_order
FROM pacs, (VALUES
  ('/placeholder.svg?height=300&width=400', 'PACS Office Building', 1),
  ('/placeholder.svg?height=300&width=400', 'Tractor Rental Service', 2),
  ('/placeholder.svg?height=300&width=400', 'Members Meeting', 3),
  ('/placeholder.svg?height=300&width=400', 'Fertilizer Storage Facility', 4),
  ('/placeholder.svg?height=300&width=400', 'Quality Seeds Supply', 5),
  ('/placeholder.svg?height=300&width=400', 'Credit Facility Counter', 6)
) AS gallery(image_url, caption, display_order)
WHERE slug = 'rajnagar-pacs';

-- Insert gallery images for Basavakalyan PACS
INSERT INTO pacs_gallery (pacs_id, image_url, caption, display_order)
SELECT 
  id,
  image_url,
  caption,
  display_order
FROM pacs, (VALUES
  ('/placeholder.svg?height=300&width=400', 'Modern PACS Facility', 1),
  ('/placeholder.svg?height=300&width=400', 'Machinery Storage', 2),
  ('/placeholder.svg?height=300&width=400', 'Training Programs', 3),
  ('/placeholder.svg?height=300&width=400', 'Procurement Center', 4),
  ('/placeholder.svg?height=300&width=400', 'Our Team', 5),
  ('/placeholder.svg?height=300&width=400', 'Member Farmers', 6)
) AS gallery(image_url, caption, display_order)
WHERE slug = 'basavakalyan-pacs';
