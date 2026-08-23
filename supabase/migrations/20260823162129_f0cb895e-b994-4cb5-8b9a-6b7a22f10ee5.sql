CREATE OR REPLACE FUNCTION public.sanitize_leaderboard_display_name()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.display_name := regexp_replace(coalesce(NEW.display_name,'Spieler'), '\s+', ' ', 'g');
  -- Strip anything that looks like an email address or contains '@'
  IF NEW.display_name ~* '[[:alnum:]._%+-]+@' OR position('@' in NEW.display_name) > 0 THEN
    NEW.display_name := 'Spieler' || substr(replace(NEW.user_id::text,'-',''), 1, 4);
  END IF;
  NEW.display_name := left(btrim(NEW.display_name), 20);
  IF NEW.display_name = '' THEN
    NEW.display_name := 'Spieler' || substr(replace(NEW.user_id::text,'-',''), 1, 4);
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS sanitize_leaderboard_display_name_trg ON public.leaderboard;
CREATE TRIGGER sanitize_leaderboard_display_name_trg
BEFORE INSERT OR UPDATE ON public.leaderboard
FOR EACH ROW EXECUTE FUNCTION public.sanitize_leaderboard_display_name();

UPDATE public.leaderboard
SET display_name = 'Spieler' || substr(replace(user_id::text,'-',''), 1, 4)
WHERE position('@' in display_name) > 0;