-- First, let's clear the existing books and add these specific 5 books
DELETE FROM books;

-- Insert the 5 specific mental health books with their cover images
INSERT INTO books (name, author, about, why_read, cover_url) VALUES
(
  'A Man Called Ove',
  'Fredrik Backman',
  'A heartwarming story about a curmudgeonly man who finds new purpose and connection through unexpected friendships and community.',
  'This book beautifully explores themes of grief, love, and the importance of human connection. It shows how kindness and community can heal even the most broken hearts, making it perfect for understanding depression and finding hope.',
  '/lovable-uploads/a36d7b80-b2c8-4b0f-8f9a-fd352a537ef1.png'
),
(
  'The Bell Jar',
  'Sylvia Plath',
  'A powerful semi-autobiographical novel that provides an intimate portrayal of depression and mental illness through the eyes of young Esther Greenwood.',
  'This classic work offers honest insight into depression and mental health struggles. It helps readers understand they are not alone in their experiences and validates the reality of mental health challenges.',
  '/lovable-uploads/4a9aa5ef-7680-4490-8006-a061b4c31c87.png'
),
(
  'The Four Agreements',
  'Don Miguel Ruiz',
  'A practical guide to personal freedom based on ancient Toltec wisdom, offering four simple principles to transform your life and find happiness.',
  'These agreements help break self-limiting beliefs and negative thought patterns. The book provides powerful tools for reducing anxiety, building self-esteem, and creating healthier relationships with yourself and others.',
  '/lovable-uploads/e8fbb2e4-571a-4b4d-a362-ed3e9a3729cd.png'
),
(
  'The Happiness Project',
  'Mon Halsey',
  'A year-long journey of practical experiments and strategies to increase happiness and well-being through small, achievable daily changes.',
  'This book offers actionable steps to improve mental health and life satisfaction. It provides evidence-based approaches to boost mood, reduce stress, and create more joy in everyday life.',
  '/lovable-uploads/30fda14a-7c0d-464b-89f0-877e625e5e4c.png'
),
(
  'When Things Fall Apart',
  'Pema Chödrön',
  'Heart advice for difficult times, offering Buddhist wisdom and practical guidance for finding peace and strength during life''s most challenging moments.',
  'This book provides comfort and wisdom for dealing with anxiety, grief, and uncertainty. It teaches acceptance, resilience, and how to find peace even in the midst of emotional turmoil.',
  '/lovable-uploads/03b95cbd-d025-4e55-b7f0-d363f9403d01.png'
);