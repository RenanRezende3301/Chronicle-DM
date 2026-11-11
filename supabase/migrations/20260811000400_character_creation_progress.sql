-- Preserve guided character creation progress across sessions. Existing
-- characters predate the guided flow, so they remain complete by default.

alter table public.characters
  add column creation_status text not null default 'complete'
    check (creation_status in ('draft', 'complete')),
  add column creation_step integer not null default 0
    check (creation_step >= 0);
