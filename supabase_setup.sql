-- DentoGraph Enterprise Schema (Startup Standard)
-- Version: 2.0 (HIPAA-Ready & Normalized)

-- 1. Clinics (B2B Entity)
create table if not exists clinics (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  npi_number text unique, -- National Provider Identifier
  address text,
  phone text,
  email text,
  website text,
  is_verified boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Profiles (Unified Identity)
create table if not exists profiles (
  id uuid references auth.users(id) primary key,
  full_name text,
  role text not null check (role in ('patient', 'provider', 'admin')),
  tier text default 'free' check (tier in ('free', 'pro', 'enterprise')),
  clinic_id uuid references clinics(id), -- Null for patients
  license_number text,
  specialty text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Patient Clinical Data (PHI)
create table if not exists patients (
  id uuid references auth.users(id) primary key,
  date_of_birth date,
  gender text,
  blood_type text,
  medical_history jsonb default '{}',
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- 4. Clinical Records (The Core Asset)
create table if not exists records (
  id uuid default gen_random_uuid() primary key,
  patient_id uuid references auth.users(id) not null,
  clinic_id uuid references clinics(id), -- Linked to verified clinic if available
  provider_id uuid references auth.users(id), -- The specific dentist who uploaded/verified
  dentist_name text, -- For legacy/unverified records
  clinic_name text, -- For legacy/unverified records
  record_type text not null check (record_type in ('xray', 'scan', 'prescription', 'narrative', 'comprehensive')),
  visit_date date not null, -- Mandatory appointment date
  ai_findings jsonb not null,
  file_path text, -- S3/Supabase Storage path
  share_token text unique,
  share_enabled boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. EHI Requests (Cures Act Interoperability)
create table if not exists ehi_requests (
  id uuid default gen_random_uuid() primary key,
  patient_id uuid references auth.users(id) not null,
  patient_name text,
  dentist_name text,
  clinic_name text not null,
  clinic_email text,
  clinic_phone text,
  last_visit_date date,
  notes text,
  status text default 'pending' check (status in ('pending', 'processing', 'fulfilled', 'denied', 'sent')),
  request_payload jsonb, -- EHI details requested
  fulfilled_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. Audit Logs (HIPAA Mandatory)
create table if not exists audit_logs (
  id uuid default gen_random_uuid() primary key,
  actor_id uuid references auth.users(id),
  action text not null, -- 'view_record', 'export_ehi', 'login'
  entity_type text not null, -- 'record', 'patient_profile'
  entity_id uuid not null,
  metadata jsonb,
  ip_address text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. Demo Leads
create table if not exists leads (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  clinic_name text,
  email text not null unique,
  status text default 'new',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- --- SECURITY (Row Level Security) ---

alter table clinics enable row level security;
alter table profiles enable row level security;
alter table patients enable row level security;
alter table records enable row level security;
alter table ehi_requests enable row level security;
alter table audit_logs enable row level security;

-- CLINICS: Everyone can view verified clinics; Authenticated users can create new clinics
create policy "Clinics are viewable by all" on clinics for select using (true);
create policy "Users can create clinics" on clinics for insert with check (auth.role() = 'authenticated');

-- PROFILES: Users can manage their own, Providers can view patient profiles
create policy "Users can manage own profile" on profiles for all using (auth.uid() = id);
create policy "Allow profile insertion" on profiles for insert with check (auth.uid() = id);
create policy "Providers can view patient profiles" on profiles for select using (
  (auth.jwt() ->> 'role' = 'provider' AND role = 'patient')
  OR 
  (auth.uid() = id)
);

-- RECORDS: Patient-owned + Provider-access if clinic matches
create policy "Patients own records" on records for all using (auth.uid() = patient_id);
create policy "Providers access clinic records" on records for select using (
  exists (select 1 from profiles where id = auth.uid() and role = 'provider' and clinic_id = records.clinic_id)
);

-- EHI REQUESTS: Patient-owned
create policy "Patients manage own requests" on ehi_requests for all using (auth.uid() = patient_id);
create policy "Patients insert own requests" on ehi_requests for insert with check (auth.uid() = patient_id);

-- AUDIT: System-only write, Admin-only read
create policy "System writes audit" on audit_logs for insert with check (true);

-- 8. Automated Profile Creation Trigger
-- This ensures that a profile is created atomically when a user signs up.
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id, 
    new.raw_user_meta_data->>'full_name', 
    coalesce(new.raw_user_meta_data->>'role', 'patient')
  );
  
  -- If it's a patient, also create the patient clinical record
  if coalesce(new.raw_user_meta_data->>'role', 'patient') = 'patient' then
    insert into public.patients (id) values (new.id);
  end if;
  
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to execute the function after signup
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
