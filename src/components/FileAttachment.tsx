import React from 'react';
import { FileText, Download, Image as ImageIcon } from 'lucide-react';
import { formatFileSize } from '../utils/fileUpload';

interface FileAttachmentProps {
    url: string;
    type: 'image' | 'document';
    name: string;
    size?: number;
}

export function FileAttachment({ url, type, name, size }: FileAttachmentProps) {
    if (type === 'image') {
        return (
            <div className="mt-2">
                <a href={url} target="_blank" rel="noopener noreferrer" className="block">
                    <img
                        src={url}
                        alt={name}
                        className="max-w-xs rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                        loading="lazy"
                    />
                </a>
                <p className="text-xs text-gray-500 mt-1">{name}</p>
            </div>
        );
    }

    // Document attachment
    return (
        <div className="mt-2">
            <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                download={name}
                className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors max-w-xs"
            >
                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{name}</p>
                    {size && <p className="text-xs text-gray-500">{formatFileSize(size)}</p>}
                </div>
                <Download className="w-4 h-4 text-gray-400 flex-shrink-0" />
            </a>
        </div>
    );
}
