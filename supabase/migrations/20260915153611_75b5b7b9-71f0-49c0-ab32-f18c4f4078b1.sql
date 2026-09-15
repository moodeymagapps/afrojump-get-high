create or replace function public.preserve_leaderboard_personal_bests()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.best_height := greatest(old.best_height, new.best_height);
  new.lava_best := greatest(old.lava_best, new.lava_best);
  new.lava_height := greatest(old.lava_height, new.lava_height);
  new.lava_time := greatest(old.lava_time, new.lava_time);
  return new;
end;
$$;

drop trigger if exists preserve_leaderboard_personal_bests_trigger on public.leaderboard;
create trigger preserve_leaderboard_personal_bests_trigger
before update on public.leaderboard
for each row
execute function public.preserve_leaderboard_personal_bests();