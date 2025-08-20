-- Create books table for entertainment content
CREATE TABLE public.books (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  author TEXT NOT NULL,
  about TEXT NOT NULL,
  why_read TEXT NOT NULL,
  cover_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (books are public content)
CREATE POLICY "Books are viewable by everyone" 
ON public.books 
FOR SELECT 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_books_updated_at
BEFORE UPDATE ON public.books
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert the book data
INSERT INTO public.books (name, author, about, why_read, cover_url) VALUES
('The Body Keeps the Score', 'Bessel van der Kolk', 'A pioneering researcher explores the profound impact of trauma on the body and brain, and presents new hope for reclaiming lives.', 'Provides a deep, scientific, and compassionate understanding of trauma, offering validation and pathways to healing.', 'https://picsum.photos/200/300?random=1'),
('Reasons to Stay Alive', 'Matt Haig', 'A personal account of the author''s struggle with depression and anxiety, and how he found his way back to life.', 'An honest, relatable, and hopeful memoir that makes anyone feeling alone in their depression feel seen and understood.', 'https://picsum.photos/200/300?random=2'),
('Maybe You Should Talk to Someone', 'Lori Gottlieb', 'A therapist goes to therapy herself, giving readers a dual perspective on the human condition and the power of connection.', 'Demystifies therapy and showcases universal human struggles with humor, warmth, and empathy.', 'https://picsum.photos/200/300?random=3'),
('The Midnight Library', 'Matt Haig', 'Between life and death there is a library filled with infinite books, each one the story of a different life you could have lived.', 'A beautiful novel that explores regret, hope, and the importance of appreciating the life we have.', 'https://picsum.photos/200/300?random=4'),
('Daring Greatly', 'Brené Brown', 'Explores the power of vulnerability and how embracing our imperfections can lead to greater courage and connection.', 'Challenges the notion that vulnerability is weakness and provides a guide to living a more wholehearted life.', 'https://picsum.photos/200/300?random=5'),
('Man''s Search for Meaning', 'Viktor E. Frankl', 'A psychiatrist''s memoir of his time in Nazi concentration camps and his discovery of logotherapy—finding meaning in all forms of existence.', 'A profound and life-affirming book that argues our primary drive is the discovery and pursuit of what we find meaningful.', 'https://picsum.photos/200/300?random=6'),
('Furiously Happy', 'Jenny Lawson', 'A hilarious and absurd memoir about using humor to fight depression and anxiety.', 'Shows that it''s possible to find joy and laughter even while struggling with mental illness. It''s a permission slip to be weird and find your own kind of happy.', 'https://picsum.photos/200/300?random=7'),
('Wherever You Go, There You Are', 'Jon Kabat-Zinn', 'A primer on mindfulness meditation and its power to reduce stress and add depth to everyday life.', 'An accessible and practical introduction to mindfulness for beginners, offering simple exercises to anchor yourself in the present.', 'https://picsum.photos/200/300?random=8'),
('The Gifts of Imperfection', 'Brené Brown', 'A guide to wholehearted living, outlining ten guideposts for cultivating courage, compassion, and connection.', 'Offers powerful advice on letting go of who you think you''re supposed to be and embracing who you are.', 'https://picsum.photos/200/300?random=9'),
('Atomic Habits', 'James Clear', 'A practical guide to breaking bad behaviors and adopting good ones through tiny, incremental changes.', 'Empowering framework for building a better life 1% at a time, focusing on systems over goals, which is great for managing anxiety and building self-efficacy.', 'https://picsum.photos/200/300?random=10'),
('The Untethered Soul', 'Michael A. Singer', 'Explores the concept of the inner voice and how to free yourself from the thoughts and emotions that limit your consciousness.', 'Provides a spiritual perspective on observing your thoughts rather than being controlled by them, which is a core tenet of mindfulness and CBT.', 'https://picsum.photos/200/300?random=11'),
('Quiet', 'Susan Cain', 'Explores the power of introverts in a world that can''t stop talking, championing introvert characteristics.', 'Validates the experience of introverts and helps them understand their strengths, reducing feelings of being ''less than'' in an extroverted culture.', 'https://picsum.photos/200/300?random=12'),
('The Five Invitations', 'Frank Ostaseski', 'A Buddhist hospice teacher shares lessons from caring for the dying, which are ultimately lessons for living a meaningful life.', 'Profoundly re-frames our relationship with death, fear, and attachment, helping to reduce anxiety and appreciate the present moment.', 'https://picsum.photos/200/300?random=13'),
('The Power of Now', 'Eckhart Tolle', 'A guide to spiritual enlightenment focusing on the importance of living in the present moment and freeing oneself from the tyranny of the mind.', 'A classic text for learning to disidentify from your anxious or depressive thoughts and find peace in the now.', 'https://picsum.photos/200/300?random=14'),
('A Man Called Ove', 'Fredrik Backman', 'A grumpy yet loveable curmudgeon finds his solitary world turned upside down when a young family moves in next door.', 'A heartwarming story about grief, connection, and unexpected friendship that shows how community can bring someone back from the brink.', 'https://picsum.photos/200/300?random=15'),
('The Four Agreements', 'Don Miguel Ruiz', 'Presents a code of conduct based on ancient Toltec wisdom for attaining personal freedom and true happiness.', 'Simple but powerful principles to reduce self-limiting beliefs, drama, and unnecessary suffering in your life.', 'https://picsum.photos/200/300?random=16'),
('The Bell Jar', 'Sylvia Plath', 'A semi-autobiographical novel that chronicles a young woman''s descent into and struggle with depression in the 1950s.', 'A seminal, brutally honest portrayal of depression that offers a sense of solidarity and understanding for those who have felt the same ''bell jar'' descend.', 'https://picsum.photos/200/300?random=17'),
('Hyperbole and a Half', 'Allie Brosh', 'A collection of autobiographical, webcomic-style stories detailing the author''s childhood and adult experiences with depression.', 'Uses crude humor and simple drawings to explain complex feelings of depression and apathy in a way that is both hilarious and devastatingly accurate.', 'https://picsum.photos/200/300?random=18'),
('When Things Fall Apart', 'Pema Chödrön', 'Offers heartfelt advice on facing difficult times with courage and compassion, drawing from Buddhist teachings.', 'Teaches how to lean into pain and uncertainty instead of running from it, transforming the way we approach suffering.', 'https://picsum.photos/200/300?random=19'),
('The Happiness Project', 'Gretchen Rubin', 'The author chronicles her year spent test-driving the wisdom of the ages, current scientific studies, and lessons from popular culture about how to be happier.', 'A practical, down-to-earth, and often funny approach to consciously building a life that contains more joy.', 'https://picsum.photos/200/300?random=20');