-- Base64 / long data URLs from cart uploads exceed VARCHAR(255). Run once:
ALTER TABLE medicines MODIFY COLUMN image_url TEXT NULL;
