ALTER TABLE public.leaderboard ADD COLUMN IF NOT EXISTS lava_height integer NOT NULL DEFAULT 0;
ALTER TABLE public.leaderboard ADD COLUMN IF NOT EXISTS lava_time integer NOT NULL DEFAULT 0;
UPDATE public.leaderboard SET lava_time = COALESCE(lava_best, 0) WHERE lava_time = 0 AND COALESCE(lava_best, 0) > 0;