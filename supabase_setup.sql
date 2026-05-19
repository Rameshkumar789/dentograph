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
  source text default 'patient' check (source in ('patient', 'clinician', 'demo')),
  visit_date date not null, -- Mandatory appointment date
  ai_findings jsonb not null,
  file_path text, -- S3/Supabase Storage path
  share_token text unique,
  share_enabled boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table records add column if not exists source text default 'patient' check (source in ('patient', 'clinician', 'demo'));

-- 5. Record Files (Normalized Source Documents)
create table if not exists record_files (
  id uuid default gen_random_uuid() primary key,
  record_id uuid references records(id) on delete cascade not null,
  patient_id uuid references auth.users(id) not null,
  storage_bucket text default 'dental-records' not null,
  storage_path text not null,
  file_name text,
  mime_type text,
  file_size bigint,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. Secure Record Shares
create table if not exists record_shares (
  id uuid default gen_random_uuid() primary key,
  record_id uuid references records(id) on delete cascade not null,
  patient_id uuid references auth.users(id) not null,
  created_by uuid references auth.users(id),
  token text unique not null default encode(gen_random_bytes(32), 'hex'),
  recipient_label text,
  recipient_email text,
  expires_at timestamp with time zone default (timezone('utc'::text, now()) + interval '14 days') not null,
  revoked_at timestamp with time zone,
  revoked_by uuid references auth.users(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. Share Access Logs
create table if not exists share_access_logs (
  id uuid default gen_random_uuid() primary key,
  share_id uuid references record_shares(id) on delete cascade,
  record_id uuid references records(id) on delete cascade,
  token_hash text,
  viewer_ip text,
  user_agent text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 8. Consent Ledger
create table if not exists consents (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) not null,
  consent_type text not null check (consent_type in ('terms', 'privacy', 'ai_processing', 'record_upload', 'record_share', 'record_request', 'provider_upload')),
  version text default '2026-05-19' not null,
  accepted boolean default true not null,
  metadata jsonb default '{}',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 9. Export Logs
create table if not exists export_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id),
  record_id uuid references records(id) on delete set null,
  export_type text not null,
  metadata jsonb default '{}',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 10. AI Processing Logs
create table if not exists ai_processing_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id),
  record_id uuid references records(id) on delete set null,
  consent_id uuid references consents(id) on delete set null,
  purpose text not null,
  model text,
  metadata jsonb default '{}',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 11. Patient Authorizations
create table if not exists patient_authorizations (
  id uuid default gen_random_uuid() primary key,
  patient_id uuid references auth.users(id) not null,
  authorization_type text not null,
  related_entity_type text,
  related_entity_id uuid,
  legal_name text,
  accepted_text text,
  metadata jsonb default '{}',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 12. Data Deletion Requests
create table if not exists data_deletion_requests (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) not null,
  status text default 'requested' check (status in ('requested', 'processing', 'completed', 'denied')),
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  completed_at timestamp with time zone
);

-- 13. EHI Requests (Cures Act Interoperability)
create table if not exists ehi_requests (
  id uuid default gen_random_uuid() primary key,
  patient_id uuid references auth.users(id) not null,
  patient_name text,
  dentist_name text,
  clinic_name text not null,
  target_clinic_id uuid references clinics(id), -- Specific ID if known
  target_clinic_name_raw text, -- Original name from request
  clinic_email text,
  clinic_phone text,
  last_visit_date date,
  notes text,
  status text default 'pending' check (status in ('pending', 'processing', 'fulfilled', 'denied', 'sent')),
  request_payload jsonb, -- EHI details requested
  fulfilled_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 14. Audit Logs (HIPAA-Aligned Event Ledger)
create table if not exists audit_logs (
  id uuid default gen_random_uuid() primary key,
  actor_id uuid references auth.users(id),
  action text not null, -- 'view_record', 'export_ehi', 'login'
  entity_type text not null, -- 'record', 'patient_profile'
  entity_id uuid not null,
  metadata jsonb,
  ip_address text,
  user_agent text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table audit_logs add column if not exists user_agent text;

-- 15. Demo Leads
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
alter table record_files enable row level security;
alter table record_shares enable row level security;
alter table share_access_logs enable row level security;
alter table consents enable row level security;
alter table export_logs enable row level security;
alter table ai_processing_logs enable row level security;
alter table patient_authorizations enable row level security;
alter table data_deletion_requests enable row level security;
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
create policy "Public can view actively shared records" on records for select using (
  exists (
    select 1 from record_shares s
    where s.record_id = records.id
      and s.revoked_at is null
      and s.expires_at > timezone('utc'::text, now())
  )
);

-- RECORD FILES: Follow patient ownership and clinic provider access
create policy "Patients own record files" on record_files for all using (auth.uid() = patient_id);
create policy "Providers view clinic record files" on record_files for select using (
  exists (
    select 1 from records r
    join profiles p on p.id = auth.uid()
    where r.id = record_files.record_id
      and p.role = 'provider'
      and p.clinic_id = r.clinic_id
  )
);

-- SHARES: Patients manage their shares; public can resolve non-revoked, non-expired random tokens
create policy "Patients manage own shares" on record_shares for all using (auth.uid() = patient_id);
create policy "Public can resolve active share tokens" on record_shares for select using (
  revoked_at is null and expires_at > timezone('utc'::text, now())
);

-- SHARE ACCESS LOGS: Append-only for public/server share views; patients can review their own share access through joined record ownership.
create policy "Anyone can insert share access logs" on share_access_logs for insert with check (true);
create policy "Patients view own share access logs" on share_access_logs for select using (
  exists (select 1 from records r where r.id = share_access_logs.record_id and r.patient_id = auth.uid())
);

-- CONSENTS: Users manage their own consent records.
create policy "Users manage own consents" on consents for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- EXPORT LOGS: Users insert/read their own export records.
create policy "Users manage own export logs" on export_logs for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- AI PROCESSING LOGS: Users insert/read their own AI processing records.
create policy "Users manage own ai logs" on ai_processing_logs for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- AUTHORIZATIONS: Patients manage their own authorizations.
create policy "Patients manage own authorizations" on patient_authorizations for all using (auth.uid() = patient_id) with check (auth.uid() = patient_id);

-- DATA DELETION: Users can create and view their own requests.
create policy "Users manage own deletion requests" on data_deletion_requests for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- EHI REQUESTS: Patient-owned
create policy "Patients manage own requests" on ehi_requests for all using (auth.uid() = patient_id);
create policy "Patients insert own requests" on ehi_requests for insert with check (auth.uid() = patient_id);

-- AUDIT: Append-only. Users can write their own events and providers/admins can read scoped events.
create policy "Users insert own audit events" on audit_logs for insert with check (actor_id = auth.uid() or actor_id is null);
create policy "Users view own audit events" on audit_logs for select using (actor_id = auth.uid());
create policy "Providers view clinic audit events" on audit_logs for select using (
  exists (
    select 1
    from profiles p
    where p.id = auth.uid()
      and p.role in ('provider', 'admin')
  )
);

-- 8. Automated Profile Creation Trigger
-- This ensures that a profile is created atomically when a user signs up.
create or replace function public.handle_new_user()
returns trigger as $$
declare
  new_clinic_id uuid;
begin
  -- 1. If the user is a provider, create their clinic first
  if (new.raw_user_meta_data->>'role') = 'provider' then
    insert into public.clinics (name, is_verified)
    values (
      coalesce(new.raw_user_meta_data->>'clinic_name', 'My Dental Practice'),
      true -- HARDCODED FOR MVP BETA ACCESS
    )
    returning id into new_clinic_id;
  end if;

  -- 2. Create the unified profile
  insert into public.profiles (id, full_name, role, clinic_id, license_number)
  values (
    new.id, 
    new.raw_user_meta_data->>'full_name', 
    coalesce(new.raw_user_meta_data->>'role', 'patient'),
    new_clinic_id,
    new.raw_user_meta_data->>'license_number'
  );
  
  -- 3. If it's a patient, also create the patient clinical record
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
