'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, User, MessageSquare, Languages, Palette, Loader2 } from 'lucide-react';
import { Tone, Language, TONE_LABELS, LANGUAGE_LABELS } from '@/types';
import { cn } from '@/lib/utils';

interface InputPanelProps {
  onGenerate: (name: string, tone: Tone, language: Language, customPrompt: string) => void;
  isGenerating: boolean;
  className?: string;
}

export default function InputPanel({ onGenerate, isGenerating, className }: InputPanelProps) {
  const [name, setName] = useState('');
  const [tone, setTone] = useState<Tone>('emotional');
  const [language, setLanguage] = useState<Language>('english');
  const [customPrompt, setCustomPrompt] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};
    
    if (!name.trim()) {
      newErrors.name = 'Please enter a name';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setErrors({});
    onGenerate(name.trim(), tone, language, customPrompt.trim());
  };

  const tones: Tone[] = ['funny', 'emotional', 'professional', 'romantic'];
  const languages: Language[] = ['english', 'urdu', 'hindi'];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className={cn('panel', className)}
    >
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary-500" />
          Create Your Card
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Enter details to generate a personalized birthday wish
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        {/* Name Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1.5">
            <User className="w-4 h-4 text-gray-400" />
            Recipient&apos;s Name *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (errors.name) setErrors({ ...errors, name: '' });
            }}
            placeholder="Enter name..."
            className={cn(
              'input-field',
              errors.name && 'border-red-500 focus:border-red-500 focus:ring-red-500'
            )}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
          )}
        </div>

        {/* Tone Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1.5">
            <MessageSquare className="w-4 h-4 text-gray-400" />
            Tone Style *
          </label>
          <div className="grid grid-cols-2 gap-2">
            {tones.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTone(t)}
                className={cn(
                  'px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 border',
                  tone === t
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-300'
                )}
              >
                {TONE_LABELS[t]}
              </button>
            ))}
          </div>
        </div>

        {/* Language Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1.5">
            <Languages className="w-4 h-4 text-gray-400" />
            Language *
          </label>
          <div className="grid grid-cols-3 gap-2">
            {languages.map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => setLanguage(lang)}
                className={cn(
                  'px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 border',
                  language === lang
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-300'
                )}
              >
                {LANGUAGE_LABELS[lang]}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Prompt (Optional) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1.5">
            <Palette className="w-4 h-4 text-gray-400" />
            Additional Context (Optional)
          </label>
          <textarea
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            placeholder="Add any specific details... e.g., 'They love hiking and coffee'"
            rows={3}
            className="input-field resize-none"
          />
        </div>

        {/* Generate Button */}
        <button
          type="submit"
          disabled={isGenerating}
          className={cn(
            'btn-primary w-full',
            isGenerating && 'opacity-75 cursor-not-allowed'
          )}
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Generating Wish...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 mr-2" />
              Generate AI Wish
            </>
          )}
        </button>

        {/* Info Text */}
        <p className="text-xs text-gray-500 text-center">
          AI-powered wish generation. No data stored.
        </p>
      </form>
    </motion.div>
  );
}
