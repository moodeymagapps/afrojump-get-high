CREATE TABLE public.seasons (
  id integer PRIMARY KEY,
  label text NOT NULL,
  is_active boolean NOT NULL DEFAULT false,
  started_at timestamptz NOT NULL DEFAULT now(),
  ended_at timestamptz
);
GRANT SELECT ON public.seasons TO anon, authenticated;
GRANT ALL ON public.seasons TO service_role;
ALTER TABLE public.seasons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "seasons public read" ON public.seasons FOR SELECT TO anon, authenticated USING (true);

CREATE TABLE public.season_results (
  season_id integer NOT NULL REFERENCES public.seasons(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  display_name text NOT NULL DEFAULT 'Spieler',
  skin text,
  best_height integer NOT NULL DEFAULT 0,
  lava_height integer NOT NULL DEFAULT 0,
  lava_time integer NOT NULL DEFAULT 0,
  total_bags integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (season_id, user_id)
);
GRANT SELECT ON public.season_results TO anon, authenticated;
GRANT ALL ON public.season_results TO service_role;
ALTER TABLE public.season_results ENABLE ROW LEVEL SECURITY;
CREATE POLICY "season results public read" ON public.season_results FOR SELECT TO anon, authenticated USING (true);
CREATE INDEX season_results_season_idx ON public.season_results (season_id, best_height DESC);

INSERT INTO public.seasons (id, label, is_active, ended_at) VALUES
  (1, 'Season 1', false, now()),
  (2, 'Season 2', true, NULL);

ALTER TABLE public.leaderboard ADD COLUMN season_id integer NOT NULL DEFAULT 1 REFERENCES public.seasons(id);

INSERT INTO public.season_results (season_id, user_id, display_name, skin, best_height, lava_height, lava_time, total_bags)
SELECT 1, user_id, display_name, skin, best_height, greatest(lava_height, 0), greatest(lava_time, lava_best), total_bags
FROM public.leaderboard;

CREATE OR REPLACE FUNCTION public.preserve_leaderboard_personal_bests()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $function$
begin
  if new.season_id is distinct from old.season_id then
    return new;
  end if;
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

UPDATE public.leaderboard
SET season_id = 2, best_height = 0, lava_best = 0, lava_height = 0, lava_time = 0;

CREATE OR REPLACE FUNCTION public.start_new_season(p_next integer, p_label text DEFAULT NULL)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
declare
  v_current integer;
begin
  select id into v_current from public.seasons where is_active order by id desc limit 1;
  if v_current is null or p_next <= v_current then
    raise exception 'Next season must be greater than current active season';
  end if;

  insert into public.season_results (season_id, user_id, display_name, skin, best_height, lava_height, lava_time, total_bags)
  select v_current, user_id, display_name, skin, best_height, lava_height, greatest(lava_time, lava_best), total_bags
  from public.leaderboard
  where season_id = v_current
  on conflict (season_id, user_id) do update
    set display_name = excluded.display_name,
        skin = excluded.skin,
        best_height = greatest(public.season_results.best_height, excluded.best_height),
        lava_height = greatest(public.season_results.lava_height, excluded.lava_height),
        lava_time = greatest(public.season_results.lava_time, excluded.lava_time),
        total_bags = greatest(public.season_results.total_bags, excluded.total_bags);

  update public.seasons set is_active = false, ended_at = now() where id = v_current;
  insert into public.seasons (id, label, is_active) values (p_next, coalesce(p_label, 'Season ' || p_next), true)
  on conflict (id) do update set is_active = true, ended_at = null;

  update public.leaderboard
  set season_id = p_next, best_height = 0, lava_best = 0, lava_height = 0, lava_time = 0;
end;
$function$;

REVOKE ALL ON FUNCTION public.start_new_season(integer, text) FROM public, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.start_new_season(integer, text) TO service_role;