create extension if not exists "uuid-ossp";

create table if not exists users (
  id uuid primary key default uuid_generate_v4(),
  email text,
  created_at timestamp with time zone default now()
);

create table if not exists certifications (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  vendor text not null,
  status text not null check (status in ('complete', 'scheduled', 'planned')),
  exam_date date,
  exam_score numeric,
  completion_date date,
  plan_type text not null check (plan_type in ('approved', 'proposed'))
);

create table if not exists resume (
  id uuid primary key default uuid_generate_v4(),
  file_url text,
  status text not null check (status in ('current', 'needs_update')),
  last_updated timestamp with time zone
);

create table if not exists profile (
  id uuid primary key default uuid_generate_v4(),
  full_name text not null,
  location text,
  phone text,
  email text,
  summary text,
  created_at timestamp with time zone default now()
);

create table if not exists skills (
  id uuid primary key default uuid_generate_v4(),
  category text,
  skill text not null,
  sort_order integer
);

create table if not exists experience (
  id uuid primary key default uuid_generate_v4(),
  role text not null,
  company text,
  location text,
  start_date text,
  end_date text,
  details text,
  category text,
  sort_order integer
);

create table if not exists linkedin_status (
  id uuid primary key default uuid_generate_v4(),
  profile_url text,
  status text not null check (status in ('current', 'needs_update')),
  last_reviewed timestamp with time zone
);

create table if not exists training_amendments (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text not null,
  status text not null check (status in ('draft', 'under_review', 'submitted', 'approved')),
  created_at timestamp with time zone default now()
);

create table if not exists amendments (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  status text not null check (status in ('draft', 'under_review', 'submitted', 'approved')),
  applicant_name text,
  location text,
  training_focus text,
  document_status text,
  summary text,
  labor_market_summary text,
  regional_employers text,
  salary_ranges text,
  employment_targets text,
  cost_disclaimer text,
  created_at timestamp with time zone default now()
);

create table if not exists timeline (
  id uuid primary key default uuid_generate_v4(),
  phase text,
  certification text not null,
  date_label text,
  format text,
  status text,
  sort_order integer
);

create table if not exists costs (
  id uuid primary key default uuid_generate_v4(),
  phase text,
  item text not null,
  provider text,
  format text,
  date_label text,
  notes text,
  amount numeric,
  sort_order integer
);

create table if not exists documents (
  id uuid primary key default uuid_generate_v4(),
  file_name text not null,
  file_type text not null check (file_type in ('certificate', 'exam_score', 'resume', 'proposal')),
  file_url text not null,
  related_type text,
  related_id uuid,
  uploaded_at timestamp with time zone default now()
);
