create table if not exists public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  company text,
  subject text not null,
  message text not null,
  status text not null default 'new',
  source text not null default 'contact_form',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.assessment_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  company text not null,
  email text not null,
  phone text,
  website text,
  industry text not null,
  company_size text,
  existing_tools text,
  challenges text not null,
  automation_areas text,
  additional_info text,
  status text not null default 'new',
  source text not null default 'assessment_form',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.contact_submissions enable row level security;
alter table public.assessment_submissions enable row level security;

drop policy if exists "Allow public contact form inserts" on public.contact_submissions;
create policy "Allow public contact form inserts"
on public.contact_submissions
for insert
to anon, authenticated
with check (true);

drop policy if exists "Allow public assessment form inserts" on public.assessment_submissions;
create policy "Allow public assessment form inserts"
on public.assessment_submissions
for insert
to anon, authenticated
with check (true);
