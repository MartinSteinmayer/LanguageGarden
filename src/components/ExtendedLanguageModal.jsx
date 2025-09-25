"use client";

import { useEffect, useRef, useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { X, Users, Globe2, BookOpen, Languages, ImageOff, ChevronLeft, ChevronRight } from 'lucide-react';
import ModalPortal from './ModalPortal';

// Try common extensions for images
const IMAGE_EXTS = ['.jpg', '.JPG', '.jpeg', '.png', '.webp'];

export default function ExtendedLanguageModal({ languageGroup, currentIndex = 0, onSelectIndex, onClose }) {
  const [activeIndex, setActiveIndex] = useState(currentIndex);
  const [imageSrc, setImageSrc] = useState(null);
  const [imageTried, setImageTried] = useState(false);
  const closeBtnRef = useRef(null);

  // Normalize languages array
  const languages = useMemo(() => {
    if (!languageGroup) return [];
    if (languageGroup.languages) {
      if (typeof languageGroup.languages === 'string') {
        try { return JSON.parse(languageGroup.languages); } catch { return []; }
      }
      return languageGroup.languages;
    }
    return [languageGroup];
  }, [languageGroup]);

  const language = languages[activeIndex];

  // Load image heuristically from public images folder
  useEffect(() => {
    if (!language) return;
    const iso = language.iso6393?.toLowerCase();
    if (!iso) return;
    let cancelled = false;
    (async () => {
      for (const ext of IMAGE_EXTS) {
        const path = `/data/images_severely_endangered/${iso}${ext}`;
        try {
          const res = await fetch(path, { method: 'HEAD' });
          if (res.ok) {
            if (!cancelled) {
              setImageSrc(path);
              setImageTried(true);
            }
            return;
          }
        } catch { /* ignore */ }
      }
      if (!cancelled) setImageTried(true);
    })();
    return () => { cancelled = true; };
  }, [activeIndex, language]);

  useEffect(() => {
    closeBtnRef.current?.focus();
  }, []);

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  if (!language) return null;

  const next = () => setActiveIndex(i => (i + 1) % languages.length);
  const prev = () => setActiveIndex(i => (i - 1 + languages.length) % languages.length);

  useEffect(() => {
    if (onSelectIndex) onSelectIndex(activeIndex);
  }, [activeIndex, onSelectIndex]);

  const metaItems = [
    { icon: <Users className="h-4 w-4 text-gray-500" />, label: 'Speakers', value: language.speakers ? language.speakers.toLocaleString() : '—' },
    { icon: <Globe2 className="h-4 w-4 text-gray-500" />, label: 'Dialect', value: language.dialect || 'Standard' },
    { icon: <Languages className="h-4 w-4 text-gray-500" />, label: 'ISO', value: language.iso6393?.toUpperCase() },
    { icon: <BookOpen className="h-4 w-4 text-gray-500" />, label: 'Voices', value: language.voiceCount ?? 0 },
  ];

  return (
    <ModalPortal>
      <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose} />
        <div className="relative w-full max-w-3xl animate-in fade-in zoom-in-95 duration-200">
          <Card className="bg-white/95 border border-white/60 rounded-xl shadow-2xl overflow-hidden">
            <button
              ref={closeBtnRef}
              onClick={onClose}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded"
              aria-label="Close extended info modal"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Header */}
            <div className="px-6 pt-6 pb-4 flex flex-col gap-1">
              <h2 className="text-2xl font-bold tracking-tight">{language.name}</h2>
              {language.officialName && <p className="text-xs font-semibold text-gray-600">{language.officialName}</p>}
              {languages.length > 1 && (
                <div className="flex items-center gap-2 mt-2">
                  <button onClick={prev} className="h-7 w-7 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200"><ChevronLeft className="h-4 w-4" /></button>
                  <span className="text-xs text-gray-500">{activeIndex + 1} / {languages.length}</span>
                  <button onClick={next} className="h-7 w-7 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200"><ChevronRight className="h-4 w-4" /></button>
                </div>
              )}
            </div>

            <Separator />

            <div className="grid md:grid-cols-2 gap-0">
              {/* Image / Placeholder */}
              <div className="relative h-64 md:h-full bg-gray-100 flex items-center justify-center">
                {imageSrc ? (
                  <img src={imageSrc} alt={language.name} className="object-cover w-full h-full" />
                ) : imageTried ? (
                  <div className="flex flex-col items-center text-gray-400 text-xs gap-2">
                    <ImageOff className="h-8 w-8" />
                    <span>No image available</span>
                  </div>
                ) : (
                  <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-500 rounded-full animate-spin" />
                )}
              </div>

              {/* Content */}
              <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Overview</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {language.description || language.notes || 'Cultural and linguistic information coming soon.'}
                  </p>
                </div>

                {language.notes && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-gray-700">Notes</h3>
                    <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-line">{language.notes}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  {metaItems.map(item => (
                    <div key={item.label} className="bg-gray-50 rounded-lg p-3 flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 text-xs font-medium text-gray-600">
                        {item.icon}{item.label}
                      </div>
                      <div className="text-sm font-semibold text-gray-800">{item.value || '—'}</div>
                    </div>
                  ))}
                </div>

                {languages.length > 1 && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-gray-700">All Languages at Location</h3>
                    <div className="flex flex-wrap gap-2">
                      {languages.map((l, idx) => (
                        <button
                          key={l.iso6393 + idx}
                          onClick={() => setActiveIndex(idx)}
                          className={`px-2.5 py-1 rounded-md text-xs border transition-colors ${
                            idx === activeIndex ? 'bg-blue-600 text-white border-blue-600' : 'bg-white hover:bg-blue-50 border-gray-200'
                          }`}
                        >
                          {l.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-2 flex justify-end gap-3">
                  <Button variant="outline" onClick={onClose} className="text-xs">Close</Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </ModalPortal>
  );
}
