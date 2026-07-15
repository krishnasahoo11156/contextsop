-- ContextSOP tenant model. Apply through the Supabase migration workflow.
create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 120),
  created_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  organization_id uuid not null references public.organizations(id) on delete restrict,
  email text not null,
  role text not null default 'member' check (role in ('owner', 'admin', 'member')),
  created_at timestamptz not null default now()
);

create table if not exists public.sops (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  title text not null,
  dsl_payload jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists sops_organization_id_idx on public.sops(organization_id);

alter table public.organizations enable row level security;
alter table public.profiles enable row level security;
alter table public.sops enable row level security;

-- The JWT must contain an org_id claim. Keep the policy at the data layer.
create policy "members can read their organization" on public.organizations for select to authenticated
  using (id::text = coalesce(auth.jwt() ->> 'org_id', ''));
create policy "members can read their profile" on public.profiles for select to authenticated
  using (organization_id::text = coalesce(auth.jwt() ->> 'org_id', ''));
create policy "tenant isolation for sops" on public.sops for all to authenticated
  using (organization_id::text = coalesce(auth.jwt() ->> 'org_id', ''))
  with check (organization_id::text = coalesce(auth.jwt() ->> 'org_id', ''));
