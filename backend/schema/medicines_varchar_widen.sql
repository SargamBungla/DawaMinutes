-- Optional: catalog names longer than 25 chars get clipped unless you widen:
ALTER TABLE medicines
  MODIFY name VARCHAR(200) NOT NULL,
  MODIFY brand VARCHAR(120) NOT NULL,
  MODIFY category VARCHAR(120) NOT NULL;
