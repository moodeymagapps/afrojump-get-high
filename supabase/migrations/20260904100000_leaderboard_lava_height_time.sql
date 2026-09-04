ALTER TABLE public.leaderboard ADD COLUMN IF NOT EXISTS lava_height integer NOT NULL DEFAULT 0;
ALTER TABLE public.leaderboard ADD COLUMN IF NOT EXISTS lava_time integer NOT NULL DEFAULT 0;
