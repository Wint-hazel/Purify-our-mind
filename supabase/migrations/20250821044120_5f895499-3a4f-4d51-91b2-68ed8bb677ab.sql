-- Create schedule_entries table for daily schedule management
CREATE TABLE public.schedule_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  entry_date DATE NOT NULL DEFAULT CURRENT_DATE,
  time_slot TIME NOT NULL,
  activity_title TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.schedule_entries ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own schedule entries" 
ON public.schedule_entries 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own schedule entries" 
ON public.schedule_entries 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own schedule entries" 
ON public.schedule_entries 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own schedule entries" 
ON public.schedule_entries 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_schedule_entries_updated_at
BEFORE UPDATE ON public.schedule_entries
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();