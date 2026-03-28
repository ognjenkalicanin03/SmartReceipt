
-- Create receipts table
CREATE TABLE public.receipts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  store TEXT NOT NULL DEFAULT 'Unknown Store',
  date TEXT NOT NULL DEFAULT to_char(now(), 'Mon DD, YYYY'),
  total NUMERIC NOT NULL DEFAULT 0,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create receipt_items table
CREATE TABLE public.receipt_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  receipt_id UUID REFERENCES public.receipts(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  price NUMERIC NOT NULL DEFAULT 0,
  category TEXT NOT NULL DEFAULT 'Other'
);

-- Enable RLS
ALTER TABLE public.receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.receipt_items ENABLE ROW LEVEL SECURITY;

-- RLS policies for receipts
CREATE POLICY "Users can insert own receipts" ON public.receipts FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can read own receipts" ON public.receipts FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own receipts" ON public.receipts FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- RLS policies for receipt_items (via receipt ownership)
CREATE POLICY "Users can insert items for own receipts" ON public.receipt_items FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM public.receipts WHERE id = receipt_id AND user_id = auth.uid()));
CREATE POLICY "Users can read items for own receipts" ON public.receipt_items FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.receipts WHERE id = receipt_id AND user_id = auth.uid()));
CREATE POLICY "Users can delete items for own receipts" ON public.receipt_items FOR DELETE TO authenticated USING (EXISTS (SELECT 1 FROM public.receipts WHERE id = receipt_id AND user_id = auth.uid()));

-- Create storage bucket for receipt images
INSERT INTO storage.buckets (id, name, public) VALUES ('receipt-images', 'receipt-images', true);

-- Storage policies
CREATE POLICY "Users can upload receipt images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'receipt-images' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Anyone can view receipt images" ON storage.objects FOR SELECT TO public USING (bucket_id = 'receipt-images');
CREATE POLICY "Users can delete own receipt images" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'receipt-images' AND (storage.foldername(name))[1] = auth.uid()::text);
