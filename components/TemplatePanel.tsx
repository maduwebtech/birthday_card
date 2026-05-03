'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Layout, Check } from 'lucide-react';
import { CardTemplate, CARD_TEMPLATES, Theme, THEME_LABELS } from '@/types';
import { cn } from '@/lib/utils';

interface TemplatePanelProps {
  selectedTemplate: CardTemplate;
  onSelectTemplate: (template: CardTemplate) => void;
  className?: string;
}

export default function TemplatePanel({
  selectedTemplate,
  onSelectTemplate,
  className,
}: TemplatePanelProps) {
  const themes: Theme[] = ['cute', 'elegant', 'luxury', 'minimal'];
  
  const getThemeTemplates = (theme: Theme) => {
    return CARD_TEMPLATES.filter((template) => template.theme === theme);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className={cn('panel', className)}
    >
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Layout className="w-5 h-5 text-primary-500" />
          Choose Template
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Select a design that matches your style
        </p>
      </div>

      <div className="p-6 space-y-6 max-h-[600px] overflow-y-auto">
        {themes.map((theme) => {
          const templates = getThemeTemplates(theme);
          if (templates.length === 0) return null;

          return (
            <div key={theme}>
              <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">
                {THEME_LABELS[theme]}
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {templates.map((template) => (
                  <motion.button
                    key={template.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onSelectTemplate(template)}
                    className={cn(
                      'relative group rounded-xl p-3 border-2 transition-all duration-200',
                      selectedTemplate.id === template.id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    )}
                  >
                    {/* Preview */}
                    <div
                      className="w-full aspect-[3/2] rounded-lg mb-2 overflow-hidden"
                      style={{
                        background: template.gradient || template.backgroundColor,
                      }}
                    >
                      {/* Mini decorations preview */}
                      <div className="w-full h-full relative">
                        {template.decorations.slice(0, 3).map((dec, idx) => (
                          <div
                            key={idx}
                            className="absolute rounded-full"
                            style={{
                              left: `${(dec.x / 600) * 100}%`,
                              top: `${(dec.y / 400) * 100}%`,
                              width: Math.max(dec.size / 6, 8),
                              height: Math.max(dec.size / 6, 8),
                              backgroundColor: dec.color,
                              transform: `rotate(${dec.rotation || 0}deg)`,
                            }}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Template Name */}
                    <p className="text-sm font-medium text-gray-900 text-center">
                      {template.name}
                    </p>

                    {/* Selected Indicator */}
                    {selectedTemplate.id === template.id && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </motion.button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
