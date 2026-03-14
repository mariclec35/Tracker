insert into certifications (name, vendor, status, exam_date, exam_score, completion_date, plan_type)
values
  ('Network+', 'CompTIA', 'complete', '2026-03-09', 803, '2026-03-09', 'approved'),
  ('Security+', 'CompTIA', 'complete', '2026-03-11', 792, '2026-03-11', 'approved'),
  ('Cloud+', 'CompTIA', 'scheduled', '2026-03-17', null, null, 'approved'),
  ('Microsoft Technology Associate (MTA) - Windows Server Administration Fundamentals', 'Microsoft', 'complete', null, null, null, 'approved'),
  ('Microsoft Technology Associate (MTA) - Security Fundamentals', 'Microsoft', 'complete', null, null, null, 'approved'),
  ('Microsoft Technology Associate (MTA) - Windows Operating System Fundamentals', 'Microsoft', 'complete', null, null, null, 'approved'),
  ('CCNA', 'Cisco', 'planned', null, null, null, 'proposed'),
  ('AWS Solutions Architect Associate', 'AWS', 'scheduled', '2026-04-06', null, null, 'proposed'),
  ('Azure Fundamentals', 'Microsoft', 'scheduled', '2026-03-30', null, null, 'proposed');

insert into profile (full_name, location, phone, email, summary)
values (
  'Christopher Maricle',
  'Saint Paul, MN',
  '507-438-4882',
  'mariclec35@gmail.com',
  'CompTIA Network+ and Security+ certified IT professional transitioning into infrastructure and cloud technology roles. Experienced in technical troubleshooting, system diagnostics, and operational monitoring in complex environments. Skilled at identifying root causes, maintaining system reliability, and documenting technical processes. Currently expanding expertise in networking, cybersecurity, and cloud infrastructure while preparing for CompTIA Cloud+.'
);

insert into skills (category, skill, sort_order)
values
  ('Networking', 'TCP/IP', 1),
  ('Networking', 'DNS', 2),
  ('Networking', 'DHCP', 3),
  ('Networking', 'Subnetting', 4),
  ('Networking', 'VLAN concepts', 5),
  ('Networking', 'OSI model', 6),
  ('Networking', 'Routing fundamentals', 7),
  ('Networking', 'Wireless standards', 8),
  ('Systems & Infrastructure', 'Windows OS fundamentals', 9),
  ('Systems & Infrastructure', 'Windows Server administration concepts', 10),
  ('Systems & Infrastructure', 'System diagnostics', 11),
  ('Systems & Infrastructure', 'Infrastructure monitoring', 12),
  ('Security', 'Access control models', 13),
  ('Security', 'Encryption fundamentals', 14),
  ('Security', 'PKI basics', 15),
  ('Security', 'Security principles', 16),
  ('Security', 'Incident response stages', 17),
  ('Troubleshooting', 'Root cause analysis', 18),
  ('Troubleshooting', 'System diagnostics', 19),
  ('Troubleshooting', 'Configuration validation', 20),
  ('Troubleshooting', 'Connectivity troubleshooting', 21),
  ('Documentation & Operations', 'Technical documentation', 22),
  ('Documentation & Operations', 'Process compliance', 23),
  ('Documentation & Operations', 'Issue tracking', 24),
  ('Documentation & Operations', 'Operational monitoring', 25);

insert into experience (role, company, location, start_date, end_date, details, category, sort_order)
values
  (
    'Information Technology Career Transition',
    null,
    'Saint Paul, MN',
    '2025',
    'Present',
    'Relocated to Saint Paul to pursue expanded opportunities in information technology.\nCompleted CompTIA Network+ and Security+ certifications and continuing development in networking, cybersecurity, and cloud infrastructure.\nPreparing for CompTIA Cloud+, with CCNA and cloud architecture certifications planned next.',
    'Career Development',
    1
  ),
  (
    'Family Caregiving',
    null,
    'Austin, MN',
    '2024',
    '2025',
    'Provided full-time care for a terminally ill parent, coordinating with family and healthcare providers to manage daily care responsibilities until their passing.',
    'Caregiving',
    2
  ),
  (
    'Printing Press Operator',
    'Smyth',
    'Austin, MN',
    'Nov 2023',
    'Sep 2024',
    'Operated and calibrated complex production systems requiring precise configuration and monitoring.\nDiagnosed operational issues to minimize downtime and maintain system reliability.\nPerformed preventative maintenance to maintain system performance.\nDocumented operational metrics and system performance logs.',
    'Professional',
    3
  ),
  (
    'Production Supervisor',
    'Geotek Inc',
    'Stewartville, MN',
    'Mar 2023',
    'Oct 2023',
    'Supervised daily operations and coordinated workflow across production teams.\nLed operational meetings reviewing performance metrics and outcomes.\nEnsured compliance with procedures and quality standards.\nImplemented process improvements to increase operational efficiency.',
    'Professional',
    4
  ),
  (
    'Pultrusion Lead',
    'Geotek Inc',
    'Stewartville, MN',
    'Oct 2021',
    'Mar 2023',
    'Led production teams operating specialized manufacturing systems.\nDiagnosed equipment performance issues and implemented corrective solutions.\nMaintained operational documentation and system run logs.\nSupported workflow improvements to increase system reliability.',
    'Professional',
    5
  ),
  (
    'Assistant Manager',
    'Thrifty Motel',
    'Saint Cloud, MN',
    'Sep 2018',
    'Jul 2021',
    'Managed operational systems including scheduling, reporting, and staff coordination.\nMonitored operational performance and resolved service issues.\nPrepared operational reports and tracked business performance metrics.',
    'Professional',
    6
  ),
  (
    'Machine Technician',
    'Dubow Textile',
    'Saint Cloud, MN',
    'Apr 2018',
    'Dec 2020',
    'Performed preventative maintenance and troubleshooting on industrial equipment.\nDiagnosed mechanical and electrical system issues affecting performance.\nAssisted with installation and configuration of equipment systems.',
    'Professional',
    7
  );

insert into amendments (
  title,
  status,
  applicant_name,
  location,
  training_focus,
  document_status,
  summary,
  labor_market_summary,
  regional_employers,
  salary_ranges,
  employment_targets,
  cost_disclaimer
)
values (
  'IT Infrastructure & Cloud Engineering Training Proposal (Amended)',
  'submitted',
  'Christopher Maricle',
  'Saint Paul, Minnesota',
  'Cloud Infrastructure & Enterprise Networking',
  'Amended Proposal - Phase 1 Completed',
  'This amended training proposal documents the completed Phase 1 certifications and expands the pathway to enterprise networking and dual public cloud credentials aligned with Minnesota employer demand.',
  'Cloud computing and infrastructure engineering are among the fastest-growing segments of the IT workforce. Minnesota employers and MSPs continue to expand cloud, network, and security operations, creating strong entry-level demand.',
  'Target\nUnitedHealth Group / Optum\n3M\nBest Buy\nMedtronic\nGeneral Mills\nMSPs (Twin Cities)',
  'Entry-Level Infrastructure / NOC - $60,000-$75,000\nCloud Support / Junior Systems Admin - $70,000-$85,000\nInfrastructure Support Engineer - $75,000-$95,000\nMid-Level Cloud / Infrastructure Engineer - $100,000-$130,000+',
  'Cloud Support Engineer\nNetwork Operations Center (NOC) Technician\nJunior Systems Administrator\nInfrastructure Support Engineer\nJunior Cloud Engineer',
  'Exam vouchers are not confirmed; verify with the training provider before purchase.'
);

insert into timeline (phase, certification, date_label, format, status, sort_order)
values
  ('Phase 1', 'CompTIA Network+', 'March 9, 2026', 'Self-Study / Exam', 'Passed - 803', 1),
  ('Phase 1', 'CompTIA Security+', 'March 11, 2026', 'Self-Study / Exam', 'Passed - 792', 2),
  ('Phase 1', 'CompTIA Cloud+', 'March 17, 2026', 'Self-Study / Exam', 'In Progress', 3),
  ('Phase 2', 'Cisco CCNA', 'March 2026 (On-Demand)', 'On-Demand Course', 'Upcoming - TBD', 4),
  ('Phase 2', 'Microsoft Azure Fundamentals (AZ-900)', 'March 30, 2026', '1-Day Instructor-Led Bootcamp', 'Scheduled', 5),
  ('Phase 2', 'AWS Solutions Architect - Associate', 'April 6-8, 2026', '3-Day Instructor-Led Bootcamp', 'Scheduled', 6);

insert into costs (phase, item, provider, format, date_label, notes, amount, sort_order)
values
  (
    'Phase 1',
    'CompTIA On-Demand Bundle (Network+, Security+, Cloud+)',
    'Watermark Learning (Educate360)',
    'On-Demand',
    null,
    'Includes official learning, hands-on labs, exam prep, and exam vouchers for each certification.',
    2595.00,
    1
  ),
  (
    'Phase 2',
    'Cisco CCNA - Implementing & Admin. Cisco Solutions (VOND)',
    'Watermark Learning (Educate360)',
    'On-Demand (Virtual)',
    null,
    'Builds on prior Cisco coursework; exam voucher TBC.',
    800.00,
    2
  ),
  (
    'Phase 2',
    'Microsoft Azure Fundamentals (AZ-900)',
    'Watermark Learning (Educate360)',
    '1-Day Instructor-Led',
    'March 30, 2026',
    'Virtual instructor-led; exam voucher TBC.',
    695.00,
    3
  ),
  (
    'Phase 2',
    'AWS Architecting - Solutions Architect Associate',
    'Watermark Learning (Educate360)',
    '3-Day Instructor-Led',
    'April 6-8, 2026',
    'Virtual instructor-led; exam voucher TBC.',
    2025.00,
    4
  );
