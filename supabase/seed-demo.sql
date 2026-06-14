-- ============================================================
-- Nexo — Seed de dados demo
-- Cole no SQL Editor do Supabase e execute
-- ============================================================
DO $$
DECLARE
  oid  uuid;
  pid  uuid;
  tid  uuid;

  -- Setores
  s_com  uuid; s_fin uuid; s_rh uuid; s_ops uuid; s_ti uuid;

  -- Status de projeto
  st_bl   uuid; st_and  uuid; st_rev uuid;
  st_blok uuid; st_done uuid;

  -- Prioridades
  pr_low uuid; pr_med uuid; pr_hi uuid; pr_crit uuid;

  -- Requests (IDs pré-gerados para referenciar nos projetos)
  r1 uuid := gen_random_uuid();
  r2 uuid := gen_random_uuid();
  r3 uuid := gen_random_uuid();
  r4 uuid := gen_random_uuid();
  r5 uuid := gen_random_uuid();

BEGIN
  SELECT id INTO oid FROM organizations LIMIT 1;
  SELECT id INTO pid FROM profiles       LIMIT 1;
  SELECT id INTO tid FROM teams          LIMIT 1;

  SELECT id INTO s_com  FROM sectors WHERE org_id = oid AND name = 'Comercial'  LIMIT 1;
  SELECT id INTO s_fin  FROM sectors WHERE org_id = oid AND name = 'Financeiro' LIMIT 1;
  SELECT id INTO s_rh   FROM sectors WHERE org_id = oid AND name = 'RH'         LIMIT 1;
  SELECT id INTO s_ops  FROM sectors WHERE org_id = oid AND name = 'Operações'  LIMIT 1;
  SELECT id INTO s_ti   FROM sectors WHERE org_id = oid AND name = 'TI'         LIMIT 1;

  SELECT id INTO st_bl   FROM statuses WHERE org_id = oid AND name = 'Backlog'       AND applies_to IN ('project','both') LIMIT 1;
  SELECT id INTO st_and  FROM statuses WHERE org_id = oid AND name = 'Em Andamento'  LIMIT 1;
  SELECT id INTO st_rev  FROM statuses WHERE org_id = oid AND name = 'Em Review'     LIMIT 1;
  SELECT id INTO st_blok FROM statuses WHERE org_id = oid AND name = 'Bloqueado'     LIMIT 1;
  SELECT id INTO st_done FROM statuses WHERE org_id = oid AND name = 'Concluído'     LIMIT 1;

  SELECT id INTO pr_low  FROM priorities WHERE org_id = oid AND name = 'Baixa'   LIMIT 1;
  SELECT id INTO pr_med  FROM priorities WHERE org_id = oid AND name = 'Média'   LIMIT 1;
  SELECT id INTO pr_hi   FROM priorities WHERE org_id = oid AND name = 'Alta'    LIMIT 1;
  SELECT id INTO pr_crit FROM priorities WHERE org_id = oid AND name = 'Crítica' LIMIT 1;

  -- ---- Pedidos (requests) com dados de ROI ----
  INSERT INTO requests (id, org_id, title, description, sector_id, requester_id,
    benefit_type, current_process_cost, cost_reduction_pct, people_impacted,
    hours_saved_per_person, roi_value, created_at)
  VALUES
    (r1, oid, 'Automação de relatórios financeiros',
     'Eliminar consolidação manual de planilhas Excel enviadas por 5 áreas mensalmente.',
     s_fin, pid, 'cost_reduction', 8000, 70, 3, 12, 6440,
     now() - interval '95 days'),
    (r2, oid, 'Portal de autoatendimento RH',
     'Funcionários solicitam férias, holerites e declarações sem depender do RH.',
     s_rh, pid, 'cost_reduction', 4000, 50, 15, 3, 2675,
     now() - interval '78 days'),
    (r3, oid, 'CRM com integração WhatsApp',
     'Centralizar atendimento comercial e eliminar planilhas de follow-up.',
     s_com, pid, 'revenue_increase', 0, 0, 8, 6, 7200,
     now() - interval '62 days'),
    (r4, oid, 'Monitoramento de SLA de fornecedores',
     'Dashboard automático de compliance com contratos de fornecimento.',
     s_ops, pid, 'compliance', 6000, 40, 5, 8, 4400,
     now() - interval '47 days'),
    (r5, oid, 'Onboarding digital de clientes',
     'Substituir papel por formulários e contratos digitais com assinatura eletrônica.',
     s_com, pid, 'cost_reduction', 3000, 60, 20, 2, 4200,
     now() - interval '32 days');

  -- ---- Projetos concluídos (histórico — gera throughput no chart) ----
  -- Semana 20/04: 1 entrega
  INSERT INTO projects (org_id, title, sector_id, requester_id, assignee_id, team_id,
    status_id, priority_id, estimated_hours, actual_hours,
    start_date, expected_date, completed_at, created_at, updated_at)
  VALUES
    (oid, 'Migração banco de dados legado', s_ti, pid, pid, tid,
     st_done, pr_hi, 80, 95,
     now()-interval '75 days', now()-interval '56 days', now()-interval '53 days',
     now()-interval '78 days', now()-interval '53 days');

  -- Semana 27/04: 2 entregas
  INSERT INTO projects (org_id, title, sector_id, requester_id, assignee_id, team_id,
    status_id, priority_id, estimated_hours, actual_hours,
    start_date, expected_date, completed_at, created_at, updated_at)
  VALUES
    (oid, 'Integração API de pagamentos', s_fin, pid, pid, tid,
     st_done, pr_crit, 60, 55,
     now()-interval '70 days', now()-interval '50 days', now()-interval '46 days',
     now()-interval '72 days', now()-interval '46 days'),
    (oid, 'Automação de NFs e boletos', s_fin, pid, pid, tid,
     st_done, pr_med, 35, 33,
     now()-interval '65 days', now()-interval '46 days', now()-interval '44 days',
     now()-interval '67 days', now()-interval '44 days');

  -- Semana 04/05: 1 entrega
  INSERT INTO projects (org_id, title, sector_id, requester_id, assignee_id, team_id,
    status_id, priority_id, estimated_hours, actual_hours,
    start_date, expected_date, completed_at, created_at, updated_at)
  VALUES
    (oid, 'App de agendamento interno', s_rh, pid, pid, tid,
     st_done, pr_med, 40, 42,
     now()-interval '57 days', now()-interval '38 days', now()-interval '38 days',
     now()-interval '60 days', now()-interval '38 days');

  -- Semana 11/05: 2 entregas
  INSERT INTO projects (org_id, title, sector_id, requester_id, assignee_id, team_id,
    status_id, priority_id, estimated_hours, actual_hours,
    start_date, expected_date, completed_at, created_at, updated_at)
  VALUES
    (oid, 'Painel de KPIs comerciais', s_com, pid, pid, tid,
     st_done, pr_hi, 50, 48,
     now()-interval '50 days', now()-interval '32 days', now()-interval '32 days',
     now()-interval '53 days', now()-interval '32 days'),
    (oid, 'Refatoração pipeline CI/CD', s_ti, pid, pid, tid,
     st_done, pr_med, 24, 20,
     now()-interval '46 days', now()-interval '30 days', now()-interval '30 days',
     now()-interval '48 days', now()-interval '30 days');

  -- Semana 18/05: 1 entrega
  INSERT INTO projects (org_id, title, sector_id, requester_id, assignee_id, team_id,
    status_id, priority_id, estimated_hours, actual_hours,
    start_date, expected_date, completed_at, created_at, updated_at)
  VALUES
    (oid, 'Relatório de compliance operacional', s_ops, pid, pid, tid,
     st_done, pr_hi, 30, 28,
     now()-interval '42 days', now()-interval '25 days', now()-interval '25 days',
     now()-interval '44 days', now()-interval '25 days');

  -- Semana 25/05: 2 entregas
  INSERT INTO projects (org_id, title, sector_id, requester_id, assignee_id, team_id,
    status_id, priority_id, estimated_hours, actual_hours,
    start_date, expected_date, completed_at, created_at, updated_at)
  VALUES
    (oid, 'Integração ERP com logística', s_ops, pid, pid, tid,
     st_done, pr_hi, 70, 75,
     now()-interval '38 days', now()-interval '19 days', now()-interval '18 days',
     now()-interval '40 days', now()-interval '18 days'),
    (oid, 'Módulo de cadastro unificado', s_com, pid, pid, tid,
     st_done, pr_med, 45, 44,
     now()-interval '35 days', now()-interval '17 days', now()-interval '16 days',
     now()-interval '37 days', now()-interval '16 days');

  -- Semana 01/06: 3 entregas (concluídos no mês + ROI)
  INSERT INTO projects (org_id, title, sector_id, requester_id, assignee_id, team_id,
    status_id, priority_id, request_id, estimated_hours, actual_hours, roi_value,
    start_date, expected_date, completed_at, created_at, updated_at)
  VALUES
    (oid, 'Sistema de relatórios BI', s_fin, pid, pid, tid,
     st_done, pr_hi, r1, 120, 115, 77280,
     now()-interval '32 days', now()-interval '11 days', now()-interval '11 days',
     now()-interval '35 days', now()-interval '11 days'),
    (oid, 'Portal RH self-service', s_rh, pid, pid, tid,
     st_done, pr_med, r2, 80, 85, 32100,
     now()-interval '28 days', now()-interval '9 days', now()-interval '9 days',
     now()-interval '30 days', now()-interval '9 days'),
    (oid, 'Integração ERP Comercial', s_com, pid, pid, tid,
     st_done, pr_hi, r3, 100, 98, 86400,
     now()-interval '24 days', now()-interval '7 days', now()-interval '7 days',
     now()-interval '26 days', now()-interval '7 days');

  -- ---- Projetos em andamento ----
  INSERT INTO projects (org_id, title, sector_id, requester_id, assignee_id, team_id,
    status_id, priority_id, request_id, estimated_hours,
    start_date, expected_date, created_at, updated_at)
  VALUES
    (oid, 'CRM com integração WhatsApp', s_com, pid, pid, tid,
     st_and, pr_crit, r3, 150,
     now()-interval '15 days', now()+interval '31 days',
     now()-interval '18 days', now()),
    (oid, 'Monitoramento de SLA fornecedores', s_ops, pid, pid, tid,
     st_and, pr_hi, r4, 90,
     now()-interval '10 days', now()+interval '46 days',
     now()-interval '12 days', now()),
    (oid, 'App mobile força de vendas', s_com, pid, pid, tid,
     st_and, pr_med, NULL, 200,
     now()-interval '7 days', now()+interval '48 days',
     now()-interval '9 days', now()),
    (oid, 'Onboarding digital de clientes', s_com, pid, pid, tid,
     st_and, pr_hi, r5, 70,
     now()-interval '5 days', now()+interval '6 days',
     now()-interval '7 days', now());

  -- ---- Projetos em review ----
  INSERT INTO projects (org_id, title, sector_id, requester_id, assignee_id, team_id,
    status_id, priority_id, estimated_hours,
    start_date, expected_date, created_at, updated_at)
  VALUES
    (oid, 'API gateway de microserviços', s_ti, pid, pid, tid,
     st_rev, pr_hi, 110,
     now()-interval '30 days', now()+interval '6 days',
     now()-interval '32 days', now()),
    (oid, 'Dashboard operacional tempo real', s_ops, pid, pid, tid,
     st_rev, pr_med, 75,
     now()-interval '22 days', now()+interval '11 days',
     now()-interval '24 days', now());

  -- ---- Projetos bloqueados (= atrasados pois expected_date < hoje) ----
  INSERT INTO projects (org_id, title, sector_id, requester_id, assignee_id, team_id,
    status_id, priority_id, estimated_hours,
    start_date, expected_date, created_at, updated_at)
  VALUES
    (oid, 'Migração para cloud AWS', s_ti, pid, pid, tid,
     st_blok, pr_crit, 300,
     now()-interval '60 days', now()-interval '4 days',
     now()-interval '65 days', now()),
    (oid, 'Compliance LGPD — módulo 2', s_ops, pid, pid, tid,
     st_blok, pr_hi, 60,
     now()-interval '40 days', now()-interval '6 days',
     now()-interval '42 days', now());

  -- ---- Projeto em backlog ----
  INSERT INTO projects (org_id, title, sector_id, requester_id, team_id,
    status_id, priority_id, estimated_hours, expected_date, created_at, updated_at)
  VALUES
    (oid, 'Chatbot de suporte ao colaborador', s_ti, pid, tid,
     st_bl, pr_low, 180,
     now()+interval '90 days',
     now()-interval '2 days', now());

END;
$$;
