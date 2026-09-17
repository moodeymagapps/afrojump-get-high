ALTER TABLE public.leaderboard
  ADD COLUMN IF NOT EXISTS season2_best_height integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS season2_lava_height integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS season2_lava_time integer NOT NULL DEFAULT 0;

CREATE OR REPLACE FUNCTION public.preserve_leaderboard_personal_bests()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $function$
begin
  new.best_height := greatest(old.best_height, new.best_height);
  new.lava_best := greatest(old.lava_best, new.lava_best);
  new.lava_height := greatest(old.lava_height, new.lava_height);
  new.lava_time := greatest(old.lava_time, new.lava_time);
  new.season2_best_height := greatest(old.season2_best_height, new.season2_best_height);
  new.season2_lava_height := greatest(old.season2_lava_height, new.season2_lava_height);
  new.season2_lava_time := greatest(old.season2_lava_time, new.season2_lava_time);
  return new;
end;
$function$;