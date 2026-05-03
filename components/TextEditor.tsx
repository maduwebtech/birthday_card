'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Type, AlignLeft, AlignCenter, AlignRight, Bold, Italic, Trash2, RefreshCw } from 'lucide-react';
import { FONTS, COLORS } from '@/types';
import { cn } from '@/lib/utils';

interface TextEditorProps {
  wishText: string;
  onWishTextChange: (text: string) => void;
  onRegenerate: () => void;
  isGenerating: boolean;
  className?: string;
}

export default function TextEditor({
  wishText,
  onWishTextChange,
  onRegenerate,
  isGenerating,
  className,
}: TextEditorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className={cn('panel', className)}
    >
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Type className="w-5 h-5 text-primary-500" />
          Edit Wish Text
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Customize the generated birthday wish
        </p>
      </div>

      <div className="p-6 space-y-5">
        {/* Text Area */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Wish Message
          </label>
          <textarea
            value={wishText}
            onChange={(e) => onWishTextChange(e.target.value)}
            rows={5}
            className="input-field resize-none text-base leading-relaxed"
            placeholder="Your birthday wish will appear here..."
          />
          <p className="mt-1 text-xs text-gray-500">
            {wishText.length} characters
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={onRegenerate}
            disabled={isGenerating}
            className={cn(
              'btn-secondary flex-1',
              isGenerating && 'opacity-75 cursor-not-allowed'
            )}
          >
            <RefreshCw className={cn('w-4 h-4 mr-2', isGenerating && 'animate-spin')} />
            Regenerate
          </button>
          <button
            onClick={() => onWishTextChange('')}
            className="btn-secondary text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Tips */}
        <div className="bg-amber-50 rounded-lg p-4 text-sm text-amber-800">
          <p className="font-medium mb-1">Tips for a great wish:</p>
          <ul className="list-disc list-inside space-y-1 text-amber-700 text-xs">
            <li>Keep it personal and heartfelt</li>
            <li>Add specific memories or inside jokes</li>
            <li>Include emojis for extra warmth</li>
            <li>Mention qualities you appreciate about them</li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
}
