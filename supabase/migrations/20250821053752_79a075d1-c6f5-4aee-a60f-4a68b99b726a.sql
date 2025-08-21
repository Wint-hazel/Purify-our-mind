-- Create storage bucket for daily plan photos
INSERT INTO storage.buckets (id, name, public) VALUES ('daily-photos', 'daily-photos', true);

-- Create policies for daily photos bucket
CREATE POLICY "Users can view their own daily photos" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'daily-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload their own daily photos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'daily-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own daily photos" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'daily-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own daily photos" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'daily-photos' AND auth.uid()::text = (storage.foldername(name))[1]);