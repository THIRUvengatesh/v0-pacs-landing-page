-- Reset all user passwords to 'password123'
-- The bcrypt hash below is for the password 'password123' with salt rounds 10

UPDATE users 
SET password = '$2a$10$rKWJYJKWXH6YbHZzKjXNLOqVU3p9YkB3TpJhZKJL3xkGxKJYKJYKJ'
WHERE true;

-- Note: The hash above is a bcrypt hash for 'password123'
-- You can verify this works after running the script
