-- ==========================================
-- EMAIL NOTIFICATIONS SETUP GUIDE
-- ==========================================
-- Note: Sending emails requires an external service (like Resend, SendGrid) and a backend (Supabase Edge Functions).
-- You cannot send emails directly from the database without extensions like pg_net, which are not always enabled on free tier.

-- 1. Create a table to track last notification sent time
CREATE TABLE IF NOT EXISTS public.notification_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  notification_type TEXT NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 2. Logic for "Offline for 20 minutes"
-- You need a way to track "last_seen".
-- Add last_seen to users table if not exists
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS last_seen TIMESTAMP WITH TIME ZONE DEFAULT now();

-- 3. Create a function to check for unread messages and offline users
-- This function would be called by pg_cron (if available) or an external scheduler.

/*
  Pseudo-code for Edge Function (TypeScript):
  
  import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
  import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

  serve(async (req) => {
    const supabase = createClient(Deno.env.get('SUPABASE_URL'), Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'))
    
    // 1. Get users with unread messages who are offline > 20 mins
    const twentyMinsAgo = new Date(Date.now() - 20 * 60 * 1000).toISOString()
    
    const { data: users } = await supabase
      .from('users')
      .select('id, email, last_seen, notifications(unread_count)')
      .lt('last_seen', twentyMinsAgo)
      .gt('notifications.unread_count', 0)
    
    // 2. Filter users who haven't been notified recently
    // ... logic to check notification_logs ...

    // 3. Send emails
    for (const user of users) {
      await sendEmail(user.email, "You have unread messages on Hovallo")
      // Log notification
      await supabase.from('notification_logs').insert({ user_id: user.id, notification_type: 'unread_messages' })
    }
    
    return new Response("Done", { status: 200 })
  })
*/

-- 4. To update 'last_seen', you should add a hook in your App.tsx or a global provider
-- that updates the user's last_seen timestamp every few minutes while they are active.
