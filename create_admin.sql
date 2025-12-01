-- Replace 'user_email@example.com' with the actual email of the user you want to make admin
UPDATE public.users
SET role = 'admin'
WHERE email = 'user_email@example.com';

-- Verify the change
SELECT * FROM public.users WHERE role = 'admin';
