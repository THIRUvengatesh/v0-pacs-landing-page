-- Update Rajnagar PACS Agricultural Loans service with detailed information
UPDATE pacs_services
SET 
  detailed_description = 'Our agricultural loan program provides comprehensive financial support to farmers for all farming activities including crop production, livestock, and farm equipment purchase. We offer flexible repayment terms aligned with harvest cycles and competitive interest rates subsidized by government schemes.',
  benefits = ARRAY[
    'Interest rates starting from 7% per annum',
    'Flexible repayment schedule based on crop harvest',
    'No processing fees for loans up to ₹1 lakh',
    'Quick approval within 7 working days',
    'Option for loan insurance coverage',
    'Special schemes for women farmers'
  ],
  eligibility = 'Must be a registered member of the PACS. Own or lease agricultural land in the service area. Clear credit history with no defaults.',
  required_documents = ARRAY[
    'PACS membership certificate',
    'Land ownership documents (7/12 extract)',
    'Aadhaar card and PAN card',
    'Bank passbook (last 6 months)',
    'Income certificate',
    'Recent passport-size photographs'
  ],
  process_steps = ARRAY[
    'Visit PACS office and collect loan application form',
    'Fill application form with required details and attach documents',
    'Submit application to loan officer for initial verification',
    'Field inspection will be conducted by PACS officials',
    'Loan committee reviews and approves the application',
    'Sign loan agreement and receive disbursement within 2-3 days'
  ],
  fees = '₹500 - ₹2,000 (based on loan amount)',
  contact_person = 'Prakash Rao (Manager)',
  contact_phone = '+91 9876543212'
WHERE service_name = 'Agricultural Loans' 
AND pacs_id IN (SELECT id FROM pacs WHERE slug = 'rajnagar-pacs');

-- Update Rajnagar PACS Fertilizer & Seed Supply service
UPDATE pacs_services
SET 
  detailed_description = 'Access certified and quality seeds, fertilizers, pesticides, and other agricultural inputs at subsidized government rates. We maintain a well-stocked inventory of essential inputs for all major crops grown in the region.',
  benefits = ARRAY[
    'Government-subsidized rates (20-30% cheaper than market)',
    'Guaranteed quality certified seeds',
    'Technical guidance on proper usage',
    'Home delivery for bulk orders',
    'Credit facility available for registered members',
    'Special discount during sowing season'
  ],
  eligibility = 'Open to all farmers in the area. PACS members get additional discounts and credit facilities.',
  required_documents = ARRAY[
    'Aadhaar card for identification',
    'Land records (for subsidy claims)',
    'PACS membership card (for credit facility)'
  ],
  process_steps = ARRAY[
    'Visit PACS supply counter or call for availability',
    'Place order specifying seed/fertilizer type and quantity',
    'Pay cash or avail credit facility (members only)',
    'Collect supplies from warehouse or opt for home delivery',
    'Get receipt and usage guidelines from staff'
  ],
  fees = 'No service charges. Only product cost.',
  contact_person = 'Suresh Naik',
  contact_phone = '+91 9876543222'
WHERE service_name = 'Fertilizer & Seed Supply' 
AND pacs_id IN (SELECT id FROM pacs WHERE slug = 'rajnagar-pacs');

-- Update Rajnagar PACS Tractor Rental service
UPDATE pacs_services
SET 
  detailed_description = 'Rent modern, well-maintained tractors and farm equipment for all agricultural operations including plowing, sowing, harvesting, and transportation. Our equipment is regularly serviced and operated by trained drivers.',
  benefits = ARRAY[
    'Affordable rental rates (40% cheaper than private rentals)',
    'Well-maintained modern equipment',
    'Experienced operators available',
    'Flexible hourly or daily rental options',
    'Priority booking for PACS members',
    'Fuel-efficient machines reduce operational costs'
  ],
  eligibility = 'Available to all farmers. Members get priority booking and discounted rates.',
  required_documents = ARRAY[
    'Identity proof (Aadhaar/Voter ID)',
    'Contact details and address',
    'Security deposit or member guarantee'
  ],
  process_steps = ARRAY[
    'Check equipment availability by calling our office',
    'Book equipment at least 1 day in advance',
    'Provide required documents and pay security deposit',
    'Equipment will be delivered to your field at scheduled time',
    'After use, pay rental charges and collect deposit refund'
  ],
  fees = '₹350-₹400 per hour or ₹2,500-₹3,000 per day',
  contact_person = 'Ramesh Kumar',
  contact_phone = '+91 9876543220'
WHERE service_name = 'Tractor Rental' 
AND pacs_id IN (SELECT id FROM pacs WHERE slug = 'rajnagar-pacs');

-- Update Rajnagar PACS Savings & Deposits service
UPDATE pacs_services
SET 
  detailed_description = 'Build your financial security with our attractive savings schemes designed specifically for farmers. We offer multiple deposit options with competitive interest rates and easy withdrawal facilities.',
  benefits = ARRAY[
    'Interest rates up to 8% per annum',
    'No minimum balance requirement',
    'Easy deposit and withdrawal facilities',
    'Passbook provided for all transactions',
    'Eligible for emergency loans against deposits',
    'Tax benefits under applicable schemes'
  ],
  eligibility = 'Must be a PACS member. Open to individuals and joint accounts.',
  required_documents = ARRAY[
    'PACS membership form',
    'Aadhaar card',
    'PAN card (for deposits above ₹50,000)',
    'Recent passport-size photographs',
    'Nominee details and identity proof'
  ],
  process_steps = ARRAY[
    'Visit PACS office with required documents',
    'Fill account opening form and provide nominee details',
    'Make initial deposit (minimum ₹100)',
    'Receive passbook and account details',
    'Start making regular deposits to build savings'
  ],
  fees = 'Free account opening. No maintenance charges.',
  contact_person = 'Prakash Rao (Manager)',
  contact_phone = '+91 9876543212'
WHERE service_name = 'Savings & Deposits' 
AND pacs_id IN (SELECT id FROM pacs WHERE slug = 'rajnagar-pacs');

-- Update Rajnagar PACS Procurement Services
UPDATE pacs_services
SET 
  detailed_description = 'Sell your agricultural produce directly to PACS at fair market prices with guaranteed payment. We procure various crops and provide farmers with better price realization compared to middlemen.',
  benefits = ARRAY[
    'Minimum Support Price (MSP) guaranteed',
    'No middleman commission',
    'Payment within 48 hours of delivery',
    'Quality testing done transparently',
    'Free weighing and grading facility',
    'Option for advance payment (up to 80%)'
  ],
  eligibility = 'Open to all farmers. PACS members get priority and advance payment options.',
  required_documents = ARRAY[
    'Land ownership documents',
    'Aadhaar card',
    'Bank account details for payment',
    'PACS membership card (if applicable)'
  ],
  process_steps = ARRAY[
    'Contact PACS office to check procurement schedule',
    'Bring produce to PACS collection center',
    'Quality testing and grading will be done',
    'Produce will be weighed in your presence',
    'Sign delivery receipt with quantity and quality details',
    'Receive payment via bank transfer within 48 hours'
  ],
  fees = 'No charges for members. ₹50 per quintal for non-members.',
  contact_person = 'Suresh Reddy (Secretary)',
  contact_phone = '+91 9876543211'
WHERE service_name = 'Procurement Services' 
AND pacs_id IN (SELECT id FROM pacs WHERE slug = 'rajnagar-pacs');

-- Update services for Basavakalyan PACS with similar detailed information
UPDATE pacs_services
SET 
  detailed_description = 'Flexible agricultural credit facilities tailored to your farming needs. Whether you need short-term crop loans or long-term investment loans, we provide competitive interest rates and farmer-friendly terms.',
  benefits = ARRAY[
    'Interest rates from 7% per annum',
    'Customized repayment schedules',
    'Quick processing within 5-7 days',
    'Loan insurance options available',
    'Zero processing fees for amounts up to ₹1.5 lakh',
    'Additional credit limit for consistent borrowers'
  ],
  eligibility = 'PACS membership required. Must have agricultural land or farming activity proof.',
  required_documents = ARRAY[
    'PACS membership documents',
    'Land records (7/12 or equivalent)',
    'Aadhaar and PAN cards',
    'Bank statements (6 months)',
    'Income proof',
    'Two passport photos'
  ],
  process_steps = ARRAY[
    'Collect and fill loan application form',
    'Submit form with supporting documents',
    'Field verification by PACS team',
    'Loan committee meeting and approval',
    'Execute loan agreement',
    'Disbursement within 2 days of approval'
  ],
  fees = '₹500 - ₹3,000 depending on loan amount',
  contact_person = 'Venkatesh Rao (Manager)',
  contact_phone = '+91 9876543215'
WHERE service_name = 'Agricultural Loans' 
AND pacs_id IN (SELECT id FROM pacs WHERE slug = 'basavakalyan-pacs');

-- Update Basavakalyan Tractor Rental
UPDATE pacs_services
SET 
  detailed_description = 'Modern farm machinery rental service with well-trained operators. Our fleet includes tractors, tillers, harvesters, and other equipment for all agricultural operations.',
  benefits = ARRAY[
    'Competitive rental rates',
    'Latest model equipment',
    'Trained operators included',
    'Flexible booking - hourly/daily/seasonal',
    'Member discounts up to 15%',
    'Emergency service available'
  ],
  eligibility = 'All farmers can avail. Members get priority during peak season.',
  required_documents = ARRAY[
    'Photo ID proof',
    'Address proof',
    'Refundable security deposit'
  ],
  process_steps = ARRAY[
    'Call office for availability check',
    'Book minimum 24 hours in advance',
    'Provide documents and security deposit',
    'Equipment delivered to your location',
    'Complete work and notify PACS',
    'Pay rental and get deposit back'
  ],
  fees = '₹380-₹420 per hour or ₹2,800-₹3,200 per day',
  contact_person = 'Hanumantha Rao',
  contact_phone = '+91 9876543224'
WHERE service_name = 'Tractor Rental' 
AND pacs_id IN (SELECT id FROM pacs WHERE slug = 'basavakalyan-pacs');
