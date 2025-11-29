import { supabase } from './supabase';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
const ALLOWED_DOCUMENT_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

export interface FileUploadResult {
    url: string;
    type: 'image' | 'document';
    name: string;
    size: number;
}

/**
 * Validate file before upload
 */
export function validateFile(file: File): { valid: boolean; error?: string } {
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
        return { valid: false, error: 'File size must be less than 10MB' };
    }

    // Check file type
    const allowedTypes = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_DOCUMENT_TYPES];
    if (!allowedTypes.includes(file.type)) {
        return { valid: false, error: 'File type not supported. Please upload images (JPG, PNG, GIF, WebP) or documents (PDF, DOC, DOCX)' };
    }

    return { valid: true };
}

/**
 * Upload a file to Supabase Storage for chat
 */
export async function uploadChatFile(file: File, userId: string): Promise<FileUploadResult> {
    // Validate file
    const validation = validateFile(file);
    if (!validation.valid) {
        throw new Error(validation.error);
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(7);
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${timestamp}-${randomString}.${fileExt}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
        .from('chat-files')
        .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
        });

    if (error) {
        console.error('Error uploading file:', error);
        throw new Error('Failed to upload file');
    }

    // Get public URL
    const { data: urlData } = supabase.storage
        .from('chat-files')
        .getPublicUrl(fileName);

    // Determine file type
    const fileType = ALLOWED_IMAGE_TYPES.includes(file.type) ? 'image' : 'document';

    return {
        url: urlData.publicUrl,
        type: fileType,
        name: file.name,
        size: file.size
    };
}

/**
 * Delete a file from Supabase Storage
 */
export async function deleteChatFile(fileUrl: string): Promise<void> {
    try {
        // Extract file path from URL
        const url = new URL(fileUrl);
        const pathParts = url.pathname.split('/');
        const fileName = pathParts.slice(-2).join('/'); // userId/filename

        const { error } = await supabase.storage
            .from('chat-files')
            .remove([fileName]);

        if (error) {
            console.error('Error deleting file:', error);
            throw new Error('Failed to delete file');
        }
    } catch (err) {
        console.error('Failed to delete file:', err);
        throw err;
    }
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}
