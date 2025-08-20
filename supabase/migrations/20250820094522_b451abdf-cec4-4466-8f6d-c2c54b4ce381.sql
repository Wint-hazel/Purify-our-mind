-- Update book covers with accessible image URLs
UPDATE books SET cover_url = 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop&crop=top' WHERE name = 'A Man Called Ove';

UPDATE books SET cover_url = 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop&crop=center' WHERE name = 'The Bell Jar';

UPDATE books SET cover_url = 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=300&h=400&fit=crop&crop=center' WHERE name = 'The Four Agreements';

UPDATE books SET cover_url = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=400&fit=crop&crop=center' WHERE name = 'The Happiness Project';

UPDATE books SET cover_url = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop&crop=center' WHERE name = 'When Things Fall Apart';