-- ============================================================
-- Mini Gestor de Esteira — Schema Supabase
-- Cole este SQL no SQL Editor do seu projeto Supabase
-- ============================================================

-- 1. Organização (fake multi-tenant: uma org, mas estrutura correta)
create table organizations (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  created_at timestamptz default now()
);

insert into organizations (name) values ('Minha Empresa');

-- 2. Setores (configurável em Settings)
create table sectors (
  id uuid default gen_random_uuid() primary key,
  org_id uuid references organizations(id) not null,
  name text not null,
  color text not null default '#6366f1',
  active boolean default true,
  created_at timestamptz default now()
);

-- 3. Times de desenvolvimento (configurável em Settings)
create table teams (
  id uuid default gen_random_uuid() primary key,
  org_id uuid references organizations(id) not null,
  name text not null,
  description text,
  active boolean default true,
  created_at timestamptz default now()
);

-- 4. Perfis de usuário
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  org_id uuid references organizations(id) not null,
  email text unique not null,
  full_name text not null,
  role text not null default 'solicitante'
    check (role in ('admin', 'gestor', 'dev', 'solicitante')),
  team_id uuid references teams(id),
  avatar_url text,
  active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 5. Status configuráveis (para requests e/ou projects)
create table statuses (
  id uuid default gen_random_uuid() primary key,
  org_id uuid references organizations(id) not null,
  name text not null,
  color text not null default '#6366f1',
  applies_to text not null check (applies_to in ('request', 'project', 'both')),
  position integer not null default 0,
  is_final boolean default false,
  created_at timestamptz default now()
);

-- 6. Prioridades configuráveis
create table priorities (
  id uuid default gen_random_uuid() primary key,
  org_id uuid references organizations(id) not null,
  name text not null,
  color text not null default '#f59e0b',
  level integer not null default 0,
  sla_days integer,
  created_at timestamptz default now()
);

-- 7. Campos dinâmicos do formulário de pedido (configurável em Settings)
create table form_fields (
  id uuid default gen_random_uuid() primary key,
  org_id uuid references organizations(id) not null,
  label text not null,
  field_type text not null
    check (field_type in ('text', 'textarea', 'select', 'number', 'date', 'checkbox')),
  placeholder text,
  options jsonb,
  required boolean default false,
  position integer not null default 0,
  active boolean default true,
  created_at timestamptz default now()
);

-- 8. Config de ROI (por org)
create table roi_config (
  id uuid default gen_random_uuid() primary key,
  org_id uuid references organizations(id) unique not null,
  hourly_rate numeric not null default 150,
  overhead_multiplier numeric not null default 1.3,
  updated_at timestamptz default now()
);

-- 9. Pedidos (Requests) — abertos pelos setores
create table requests (
  id uuid default gen_random_uuid() primary key,
  org_id uuid references organizations(id) not null,
  title text not null,
  description text,
  sector_id uuid references sectors(id),
  requester_id uuid references profiles(id) not null,
  status_id uuid references statuses(id),
  priority_id uuid references priorities(id),
  form_data jsonb default '{}',
  -- ROI inputs (preenchidos pelo solicitante)
  benefit_type text check (benefit_type in ('cost_reduction', 'revenue_increase', 'compliance', 'quality')),
  current_process_cost numeric default 0,
  cost_reduction_pct numeric default 0,
  people_impacted integer default 0,
  hours_saved_per_person numeric default 0,
  roi_value numeric,  -- economia mensal calculada
  expected_date date,
  kanban_position integer default 0,
  approved_by uuid references profiles(id),
  approved_at timestamptz,
  rejected_reason text,
  project_id uuid,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 10. Projetos — trabalhados pelo time de dev
create table projects (
  id uuid default gen_random_uuid() primary key,
  org_id uuid references organizations(id) not null,
  title text not null,
  description text,
  sector_id uuid references sectors(id),
  requester_id uuid references profiles(id),
  assignee_id uuid references profiles(id),
  team_id uuid references teams(id),
  status_id uuid references statuses(id) not null,
  priority_id uuid references priorities(id),
  request_id uuid references requests(id),
  estimated_hours numeric,
  actual_hours numeric,
  roi_value numeric,
  start_date date,
  expected_date date,
  homologation_date date,
  completed_at timestamptz,
  analysis jsonb default '{}'::jsonb,
  kanban_position integer default 0,
  tags text[] default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table requests
  add constraint requests_project_id_fk
  foreign key (project_id) references projects(id);

-- 11. Histórico de mudanças (status, assignee, etc.)
create table project_history (
  id uuid default gen_random_uuid() primary key,
  project_id uuid references projects(id) on delete cascade not null,
  changed_by uuid references profiles(id) not null,
  field_changed text not null,
  old_value text,
  new_value text,
  notes text,
  created_at timestamptz default now()
);

-- ============================================================
-- Triggers
-- ============================================================

create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

create trigger profiles_updated_at before update on profiles
  for each row execute function update_updated_at();
create trigger requests_updated_at before update on requests
  for each row execute function update_updated_at();
create trigger projects_updated_at before update on projects
  for each row execute function update_updated_at();

-- Auto-cria profile no signup
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
declare
  org_id uuid;
begin
  select id into org_id from organizations limit 1;
  insert into profiles (id, org_id, email, full_name, role)
  values (
    new.id,
    org_id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'role', 'solicitante')
  );
  return new;
end;
$$;

create trigger on_auth_user_created after insert on auth.users
  for each row execute function handle_new_user();

-- ============================================================
-- RLS (Row Level Security)
-- ============================================================

alter table organizations enable row level security;
alter table sectors enable row level security;
alter table teams enable row level security;
alter table profiles enable row level security;
alter table statuses enable row level security;
alter table priorities enable row level security;
alter table form_fields enable row level security;
alter table roi_config enable row level security;
alter table requests enable row level security;
alter table projects enable row level security;
alter table project_history enable row level security;

-- Todos autenticados leem a organização
create policy "org_select" on organizations for select using (auth.role() = 'authenticated');

-- Todos autenticados leem setores, times, perfis, status, prioridades, campos, config ROI
create policy "sectors_select" on sectors for select using (auth.role() = 'authenticated');
create policy "teams_select" on teams for select using (auth.role() = 'authenticated');
create policy "profiles_select" on profiles for select using (auth.role() = 'authenticated');
create policy "statuses_select" on statuses for select using (auth.role() = 'authenticated');
create policy "priorities_select" on priorities for select using (auth.role() = 'authenticated');
create policy "form_fields_select" on form_fields for select using (auth.role() = 'authenticated');
create policy "roi_config_select" on roi_config for select using (auth.role() = 'authenticated');

-- Função auxiliar: lê o role do usuário sem passar pelo RLS (evita recursão infinita)
create or replace function auth_user_role()
returns text
language sql
security definer
stable
set search_path = public
as $$
  select role from profiles where id = auth.uid()
$$;

-- Admin/gestor gerenciam configurações
create policy "sectors_write" on sectors for all using (auth_user_role() in ('admin', 'gestor'));
create policy "teams_write" on teams for all using (auth_user_role() in ('admin', 'gestor'));
create policy "statuses_write" on statuses for all using (auth_user_role() in ('admin', 'gestor'));
create policy "priorities_write" on priorities for all using (auth_user_role() in ('admin', 'gestor'));
create policy "form_fields_write" on form_fields for all using (auth_user_role() in ('admin', 'gestor'));
create policy "roi_config_write" on roi_config for all using (auth_user_role() in ('admin', 'gestor'));
create policy "profiles_update_own" on profiles for update using (auth.uid() = id);
create policy "profiles_write_admin" on profiles for all using (auth_user_role() = 'admin');

-- Requests: todos leem, qualquer autenticado cria, gestor/admin atualiza/deleta
create policy "requests_select" on requests for select using (auth.role() = 'authenticated');
create policy "requests_insert" on requests for insert with check (auth.role() = 'authenticated');
create policy "requests_update" on requests for update using (
  auth_user_role() in ('admin', 'gestor') or auth.uid() = requester_id
);
create policy "requests_delete" on requests for delete using (auth_user_role() in ('admin', 'gestor'));

-- Projects: todos leem, gestor/dev/admin escrevem
create policy "projects_select" on projects for select using (auth.role() = 'authenticated');
create policy "projects_insert" on projects for insert with check (auth_user_role() in ('admin', 'gestor'));
create policy "projects_update" on projects for update using (auth_user_role() in ('admin', 'gestor', 'dev'));
create policy "projects_delete" on projects for delete using (auth_user_role() in ('admin', 'gestor'));

-- History: todos leem, autenticados inserem
create policy "history_select" on project_history for select using (auth.role() = 'authenticated');
create policy "history_insert" on project_history for insert with check (auth.role() = 'authenticated');

-- ============================================================
-- Dados iniciais (seed)
-- ============================================================

-- Busca o org_id
do $$
declare
  oid uuid;
begin
  select id into oid from organizations limit 1;

  -- Setores
  insert into sectors (org_id, name, color) values
    (oid, 'Comercial', '#3b82f6'),
    (oid, 'Financeiro', '#10b981'),
    (oid, 'RH', '#f59e0b'),
    (oid, 'Operações', '#8b5cf6'),
    (oid, 'TI', '#ef4444');

  -- Times
  insert into teams (org_id, name, description) values
    (oid, 'Time Alpha', 'Time de desenvolvimento principal'),
    (oid, 'Time Beta', 'Time de suporte e integrações');

  -- Status de pedidos
  insert into statuses (org_id, name, color, applies_to, position) values
    (oid, 'Backlog',      '#94a3b8', 'request', 0),
    (oid, 'Em Análise',   '#f59e0b', 'request', 1),
    (oid, 'Aprovado',     '#10b981', 'request', 2),
    (oid, 'Rejeitado',    '#ef4444', 'request', 3);

  -- Status de projetos
  insert into statuses (org_id, name, color, applies_to, position, is_final) values
    (oid, 'Backlog',      '#94a3b8', 'project', 0, false),
    (oid, 'Em Andamento', '#3b82f6', 'project', 1, false),
    (oid, 'Em Review',    '#a855f7', 'project', 2, false),
    (oid, 'Bloqueado',    '#ef4444', 'project', 3, false),
    (oid, 'Concluído',    '#10b981', 'project', 4, true);

  -- Prioridades
  insert into priorities (org_id, name, color, level, sla_days) values
    (oid, 'Baixa',   '#94a3b8', 1, 30),
    (oid, 'Média',   '#3b82f6', 2, 15),
    (oid, 'Alta',    '#f59e0b', 3, 7),
    (oid, 'Crítica', '#ef4444', 4, 2);

  -- Config ROI
  insert into roi_config (org_id, hourly_rate, overhead_multiplier) values
    (oid, 150, 1.3);

  -- Campos do formulário de pedido (exemplos)
  insert into form_fields (org_id, label, field_type, placeholder, required, position) values
    (oid, 'Objetivo do projeto',         'textarea', 'Descreva o que precisa ser feito e por quê...', true,  0),
    (oid, 'Horas estimadas necessárias', 'number',   'Ex: 40',                                        false, 1),
    (oid, 'Data desejada de entrega',    'date',     null,                                             false, 2),
    (oid, 'Benefício esperado',          'textarea', 'Qual o impacto esperado para o setor?',         false, 3);
end;
$$;
