
CREATE TABLE public.player_saves (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.player_saves TO authenticated;
GRANT ALL ON public.player_saves TO service_role;
ALTER TABLE public.player_saves ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own save select" ON public.player_saves FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "own save insert" ON public.player_saves FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own save update" ON public.player_saves FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own save delete" ON public.player_saves FOR DELETE TO authenticated USING (auth.uid() = user_id);
