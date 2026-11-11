-- Keep the indexed character name and the system document identity aligned.

create or replace function public.ensure_character_identity()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  data_name text;
begin
  if new.owner_id is distinct from old.owner_id then
    raise exception 'Character ownership is immutable';
  end if;

  if new.system_key is distinct from old.system_key then
    raise exception 'Character system is immutable';
  end if;

  if new.schema_version < old.schema_version then
    raise exception 'Character schema version cannot move backwards';
  end if;

  data_name := left(trim(coalesce(new.character_data ->> 'name', '')), 120);

  if new.name is not distinct from old.name
    and new.character_data is distinct from old.character_data
    and char_length(data_name) > 0
  then
    new.name = data_name;
  elsif new.name is distinct from old.name then
    new.name = left(trim(new.name), 120);
    new.character_data = jsonb_set(
      new.character_data,
      '{name}',
      to_jsonb(new.name),
      true
    );
  end if;

  new.version = old.version + 1;
  return new;
end;
$$;
