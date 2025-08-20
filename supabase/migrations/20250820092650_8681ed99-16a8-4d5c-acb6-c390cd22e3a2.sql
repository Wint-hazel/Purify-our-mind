-- Delete 15 books, keeping only 5
DELETE FROM books 
WHERE id IN (
  SELECT id FROM books 
  ORDER BY created_at 
  LIMIT 15
);