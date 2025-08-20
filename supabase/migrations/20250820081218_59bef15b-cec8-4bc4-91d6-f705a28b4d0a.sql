-- Create storage bucket for diary media
INSERT INTO storage.buckets (id, name, public) VALUES ('diary-media', 'diary-media', false);

-- Create diary_media table
CREATE TABLE public.diary_media (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  diary_entry_id UUID NULL,
  file_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  caption TEXT,
  file_size INTEGER NOT NULL,
  mime_type TEXT NOT NULL,
  upload_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on diary_media table
ALTER TABLE public.diary_media ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for diary_media
CREATE POLICY "Users can view their own media" 
ON public.diary_media 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own media" 
ON public.diary_media 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own media" 
ON public.diary_media 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own media" 
ON public.diary_media 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create storage policies for diary-media bucket
CREATE POLICY "Users can view their own media files" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'diary-media' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload their own media files" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'diary-media' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own media files" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'diary-media' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own media files" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'diary-media' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_diary_media_updated_at
BEFORE UPDATE ON public.diary_media
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for better performance
CREATE INDEX idx_diary_media_user_date ON public.diary_media(user_id, upload_date);
CREATE INDEX idx_diary_media_entry ON public.diary_media(diary_entry_id);