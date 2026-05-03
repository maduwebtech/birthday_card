'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Sparkles, Heart, Stars, Info, Github, Twitter } from 'lucide-react';
import InputPanel from '@/components/InputPanel';
import CanvasEditor from '@/components/CanvasEditor';
import TemplatePanel from '@/components/TemplatePanel';
import TextEditor from '@/components/TextEditor';
import { Tone, Language, CardTemplate, WishResponse, CARD_TEMPLATES, TONE_LABELS, LANGUAGE_LABELS } from '@/types';
import { cn } from '@/lib/utils';

export default function Home() {
  // State
  const [selectedTemplate, setSelectedTemplate] = useState<CardTemplate>(CARD_TEMPLATES[0]);
  const [recipientName, setRecipientName] = useState('');
  const [wishText, setWishText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastRequest, setLastRequest] = useState<{ name: string; tone: Tone; language: Language; customPrompt: string } | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('birthdayCardState');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.templateId) {
          const template = CARD_TEMPLATES.find(t => t.id === parsed.templateId);
          if (template) setSelectedTemplate(template);
        }
        if (parsed.wishText) setWishText(parsed.wishText);
        if (parsed.recipientName) setRecipientName(parsed.recipientName);
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    try {
      const state = {
        templateId: selectedTemplate.id,
        wishText,
        recipientName,
      };
      localStorage.setItem('birthdayCardState', JSON.stringify(state));
    } catch {
      // Ignore localStorage errors
    }
  }, [selectedTemplate, wishText, recipientName]);

  // Generate wish
  const generateWish = useCallback(async (name: string, tone: Tone, language: Language, customPrompt: string) => {
    setIsGenerating(true);
    setError(null);
    setLastRequest({ name, tone, language, customPrompt });
    setRecipientName(name);

    try {
      const response = await fetch('/api/generate-wish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, tone, language, customPrompt }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate wish');
      }

      setWishText(data.wish);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsGenerating(false);
    }
  }, []);

  // Regenerate with same parameters
  const handleRegenerate = useCallback(() => {
    if (lastRequest) {
      generateWish(lastRequest.name, lastRequest.tone, lastRequest.language, lastRequest.customPrompt);
    }
  }, [lastRequest, generateWish]);

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => window.location.reload()}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center shadow-lg">
                <Gift className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold gradient-text">
                  Birthday Wishes Generator
                </h1>
                <p className="text-xs text-gray-500">AI-Powered Card Creator</p>
              </div>
            </button>
            
            <div className="flex items-center gap-4">
              <a
                href="#about"
                className="hidden sm:flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Info className="w-4 h-4" />
                About
              </a>
              <a
                href="https://github.com/maduwebtech"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Github className="w-4 h-4" />
                GitHub
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Create Beautiful
            <span className="gradient-text"> Birthday Cards</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Generate personalized AI-written birthday wishes and design stunning greeting cards 
            with our easy-to-use canvas editor. No signup required.
          </p>
          
          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            {[
              { icon: Sparkles, text: 'AI Powered' },
              { icon: Heart, text: 'Personalized' },
              { icon: Stars, text: 'Multiple Languages' },
            ].map((feature) => (
              <div
                key={feature.text}
                className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-gray-100"
              >
                <feature.icon className="w-4 h-4 text-primary-500" />
                <span className="text-sm font-medium text-gray-700">{feature.text}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Error Alert */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6"
            >
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-red-600 text-xs">!</span>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <p className="text-sm text-red-600 mt-1">{error}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Three Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Panel - Input */}
          <div className="lg:col-span-3">
            <InputPanel
              onGenerate={generateWish}
              isGenerating={isGenerating}
            />
          </div>

          {/* Center Panel - Canvas */}
          <div className="lg:col-span-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <CanvasEditor
                template={selectedTemplate}
                wishText={wishText}
                recipientName={recipientName || 'Friend'}
              />
            </motion.div>

            {/* Quick Stats */}
            {wishText && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 flex items-center justify-center gap-6 text-sm text-gray-500"
              >
                <span>
                  <strong className="text-gray-700">Tone:</strong> {lastRequest ? TONE_LABELS[lastRequest.tone] : '-'}
                </span>
                <span>
                  <strong className="text-gray-700">Language:</strong> {lastRequest ? LANGUAGE_LABELS[lastRequest.language] : '-'}
                </span>
              </motion.div>
            )}
          </div>

          {/* Right Panel - Templates & Text Editor */}
          <div className="lg:col-span-3 space-y-6">
            <TemplatePanel
              selectedTemplate={selectedTemplate}
              onSelectTemplate={setSelectedTemplate}
            />
            
            {wishText && (
              <TextEditor
                wishText={wishText}
                onWishTextChange={setWishText}
                onRegenerate={handleRegenerate}
                isGenerating={isGenerating}
              />
            )}
          </div>
        </div>

        {/* How It Works Section */}
        <section id="about" className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-gray-600">Create a beautiful birthday card in three simple steps</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Enter Details',
                description: 'Fill in the recipient\'s name and choose the tone and language for your wish.',
                icon: Sparkles,
              },
              {
                step: '2',
                title: 'AI Generation',
                description: 'Our AI creates a personalized birthday wish based on your preferences.',
                icon: Gift,
              },
              {
                step: '3',
                title: 'Customize & Export',
                description: 'Choose a template, edit the text, and download your high-quality card.',
                icon: Heart,
              },
            ].map((item) => (
              <motion.div
                key={item.step}
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-6 h-6 text-primary-600" />
                </div>
                <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-3 -mt-8 border-4 border-white">
                  <span className="text-white text-sm font-bold">{item.step}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Features Grid */}
        <section className="mt-20">
          <div className="bg-gradient-to-br from-primary-500 to-purple-600 rounded-3xl p-8 sm:p-12 text-white">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold mb-4">Why Choose Our Generator?</h2>
              <p className="text-primary-100">Everything you need to create the perfect birthday greeting</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                'AI-Powered Wishes',
                '6 Beautiful Templates',
                'Multi-Language Support',
                'Canvas Editor',
                'High-Res Exports',
                'No Signup Required',
                'Free to Use',
                'Privacy Focused',
              ].map((feature) => (
                <div key={feature} className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                    <Sparkles className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-sm font-medium">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Gift className="w-5 h-5 text-primary-500" />
              <span className="font-semibold text-gray-900">Birthday Wishes Generator</span>
            </div>
            
            <p className="text-sm text-gray-500 text-center">
              Made with love. No data stored, completely private.
            </p>
            
            <div className="flex items-center gap-4">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="https://github.com/maduwebtech"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
