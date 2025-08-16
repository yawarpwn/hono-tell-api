-- BEGIN TRANSACTION;
-- INSERT INTO watermarks (id, title, width, height, url, public_id, category_id, format, is_favorite, created_at, updated_at)
-- SELECT id, title, width, height, url, public_id, category_id, format, 1, created_at, updated_at
-- FROM gallery;
-- COMMIT;
SELECT is_favorite, category_id from watermarks where is_favorite = 1; 
