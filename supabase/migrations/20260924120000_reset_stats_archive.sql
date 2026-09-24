-- Reset the live stat counts to zero without losing data: move every result
-- recorded so far (including ones from the earlier 4-option question set)
-- into an archive table. archetype_stats() only reads quiz_results, so the
-- result-page stat chip starts again from 0.

create table public.quiz_results_archive (like public.quiz_results including all);
alter table public.quiz_results_archive
  add column archived_at timestamptz not null default now();

-- Same lockdown as quiz_results: RLS on, no policies, no direct API access.
alter table public.quiz_results_archive enable row level security;

with moved as (
  delete from public.quiz_results
  returning id, archetype, answers, created_at
)
insert into public.quiz_results_archive (id, archetype, answers, created_at)
select id, archetype, answers, created_at from moved;
