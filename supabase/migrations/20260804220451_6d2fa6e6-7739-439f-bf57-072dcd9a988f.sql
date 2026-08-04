CREATE TABLE public.leaderboard (
  user_id uuid NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text NOT NULL DEFAULT 'Spieler',
  best_height integer NOT NULL DEFAULT 0,
  total_bags integer NOT NULL DEFAULT 0,
  skin text,
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT ON public.leaderboard TO anon;
GRANT SELECT, INSERT, UPDATE ON public.leaderboard TO authenticated;
GRANT ALL ON public.leaderboard TO service_role;

ALTER TABLE public.leaderboard ENABLE ROW LEVEL SECURITY;

CREATE POLICY "leaderboard public read" ON public.leaderboard FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "leaderboard own insert" ON public.leaderboard FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "leaderboard own update" ON public.leaderboard FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE INDEX leaderboard_best_height_idx ON public.leaderboard (best_height DESC);