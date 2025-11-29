-- ============================================
-- CHAT ENHANCEMENTS: File Sharing, Read Receipts, Archiving
-- Run this in Supabase SQL Editor after running fix_chat_complete.sql
-- ============================================

-- 1. Add columns to messages table for file attachments and read receipts
ALTER TABLE public.messages 
  ADD COLUMN IF NOT EXISTS attachment_url TEXT,
  ADD COLUMN IF NOT EXISTS attachment_type TEXT,
  ADD COLUMN IF NOT EXISTS attachment_name TEXT,
  ADD COLUMN IF NOT EXISTS read_at TIMESTAMP WITH TIME ZONE;

-- 2. Add archived column to conversations table
ALTER TABLE public.conversations 
  ADD COLUMN IF NOT EXISTS archived BOOLEAN DEFAULT false;

-- 3. Create storage bucket for chat files (if not exists)
INSERT INTO storage.buckets (id, name, public)
VALUES ('chat-files', 'chat-files', true)
ON CONFLICT (id) DO NOTHING;

-- 4. Storage policies for chat files
-- Allow authenticated users to upload files
DROP POLICY IF EXISTS "Authenticated users can upload chat files" ON storage.objects;
CREATE POLICY "Authenticated users can upload chat files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'chat-files');

-- Allow authenticated users to read chat files
DROP POLICY IF EXISTS "Authenticated users can read chat files" ON storage.objects;
CREATE POLICY "Authenticated users can read chat files"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'chat-files');

-- Allow users to delete their own uploaded files
DROP POLICY IF EXISTS "Users can delete their own chat files" ON storage.objects;
CREATE POLICY "Users can delete their own chat files"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'chat-files' AND auth.uid()::text = (storage.foldername(name))[1]);

-- 5. Add RLS policy for updating read_at
DROP POLICY IF EXISTS "Users can mark messages as read" ON public.messages;
CREATE POLICY "Users can mark messages as read" ON public.messages
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.conversations
      WHERE conversations.id = messages.conversation_id
      AND (conversations.participant1_id = auth.uid() OR conversations.participant2_id = auth.uid())
    )
  );

-- 6. Add RLS policy for updating archived status
DROP POLICY IF EXISTS "Users can archive their conversations" ON public.conversations;
CREATE POLICY "Users can archive their conversations" ON public.conversations
  FOR UPDATE USING (
    auth.uid() = participant1_id OR auth.uid() = participant2_id
  );

-- 7. Create indexes for performance
CREATE INDEX IF NOT EXISTS messages_read_at_idx ON public.messages(read_at);
CREATE INDEX IF NOT EXISTS conversations_archived_idx ON public.conversations(archived);
CREATE INDEX IF NOT EXISTS messages_attachment_idx ON public.messages(attachment_url) WHERE attachment_url IS NOT NULL;
