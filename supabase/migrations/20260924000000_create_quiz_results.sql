-- Stores one row per completed quiz. The table is locked down (RLS on, no
-- policies); the app only touches it through the two functions below.

create table public.quiz_results (
  id uuid primary key default gen_random_uuid(),
  archetype text not null
    check (archetype in ('counselor', 'detective', 'sprinter', 'mentor', 'guardian')),
  answers text[] not null check (cardinality(answers) = 10),
  created_at timestamptz not null default now()
);

alter table public.quiz_results enable row level security;

create index quiz_results_archetype_idx on public.quiz_results (archetype);

-- Insert a result. Called by the /api/submit route after server-side scoring.
create function public.submit_quiz_result(p_archetype text, p_answers text[])
returns uuid
language sql
security definer
set search_path = ''
as $$
  insert into public.quiz_results (archetype, answers)
  values (p_archetype, p_answers)
  returning id;
$$;

-- Aggregate counts per archetype (no row-level data exposed).
create function public.archetype_stats()
returns table (archetype text, count bigint)
language sql
stable
security definer
set search_path = ''
as $$
  select archetype, count(*) from public.quiz_results group by archetype;
$$;

revoke all on function public.submit_quiz_result(text, text[]) from public;
revoke all on function public.archetype_stats() from public;
grant execute on function public.submit_quiz_result(text, text[]) to anon, authenticated;
grant execute on function public.archetype_stats() to anon, authenticated;
