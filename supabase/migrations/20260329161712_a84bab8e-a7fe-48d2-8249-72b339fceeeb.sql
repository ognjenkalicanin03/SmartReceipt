ALTER TABLE public.profiles
  ADD COLUMN country text DEFAULT 'Serbia',
  ADD COLUMN currency text DEFAULT 'RSD';