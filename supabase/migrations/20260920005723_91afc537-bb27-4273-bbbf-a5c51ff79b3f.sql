ALTER TABLE public.leaderboard DISABLE TRIGGER preserve_leaderboard_personal_bests_trigger;

UPDATE public.leaderboard
SET best_height = 0,
    lava_best = 0,
    lava_height = 0,
    lava_time = 0,
    season2_best_height = 0,
    season2_lava_height = 0,
    season2_lava_time = 0,
    season_id = 2,
    updated_at = now()
WHERE season_id IS NOT NULL;

ALTER TABLE public.leaderboard ENABLE TRIGGER preserve_leaderboard_personal_bests_trigger;