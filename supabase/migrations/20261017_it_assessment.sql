alter table public.assessment_submissions
  add column if not exists security_needs text,
  add column if not exists cloud_spend text,
  add column if not exists it_support_needs text;
