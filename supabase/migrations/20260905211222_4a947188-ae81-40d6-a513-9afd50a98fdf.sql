UPDATE public.leaderboard SET display_name = left(coalesce(display_name,'Spieler'), 24);
UPDATE public.leaderboard SET best_height = 0 WHERE best_height IS NULL OR best_height < 0 OR best_height > 1000000;
UPDATE public.leaderboard SET lava_height = 0 WHERE lava_height IS NULL OR lava_height < 0 OR lava_height > 1000000;
UPDATE public.leaderboard SET lava_best = 0 WHERE lava_best IS NULL OR lava_best < 0 OR lava_best > 100000;
UPDATE public.leaderboard SET lava_time = 0 WHERE lava_time IS NULL OR lava_time < 0 OR lava_time > 100000;
UPDATE public.leaderboard SET total_bags = 0 WHERE total_bags IS NULL OR total_bags < 0 OR total_bags > 100000000;
UPDATE public.leaderboard SET skin = left(skin, 40) WHERE skin IS NOT NULL;

ALTER TABLE public.leaderboard
  ADD CONSTRAINT leaderboard_name_len CHECK (display_name IS NULL OR char_length(display_name) <= 24),
  ADD CONSTRAINT leaderboard_skin_len CHECK (skin IS NULL OR char_length(skin) <= 40),
  ADD CONSTRAINT leaderboard_best_height_range CHECK (best_height IS NULL OR (best_height >= 0 AND best_height <= 1000000)),
  ADD CONSTRAINT leaderboard_lava_height_range CHECK (lava_height IS NULL OR (lava_height >= 0 AND lava_height <= 1000000)),
  ADD CONSTRAINT leaderboard_lava_best_range CHECK (lava_best IS NULL OR (lava_best >= 0 AND lava_best <= 100000)),
  ADD CONSTRAINT leaderboard_lava_time_range CHECK (lava_time IS NULL OR (lava_time >= 0 AND lava_time <= 100000)),
  ADD CONSTRAINT leaderboard_total_bags_range CHECK (total_bags IS NULL OR (total_bags >= 0 AND total_bags <= 100000000));