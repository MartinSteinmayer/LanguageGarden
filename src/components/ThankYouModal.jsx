"use client";

import { useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Sparkles, Quote } from "lucide-react";
import ModalPortal from "./ModalPortal";

export default function ThankYouModal({ onClose }) {
  const closeBtnRef = useRef(null);

  // Close on ESC
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  // Focus and auto-close after 10 seconds
  useEffect(() => {
    closeBtnRef.current?.focus();
    const timer = setTimeout(onClose, 10000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <ModalPortal>
      <div
        className="fixed inset-0 z-[1001] flex items-center justify-center p-4"
        aria-modal="true"
        role="dialog"
      >
        <div
          className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-in fade-in duration-300"
          onClick={onClose}
        />
        <div className="relative w-full max-w-lg origin-center animate-in fade-in zoom-in-95 duration-500">
          <Card className="p-8 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 shadow-2xl rounded-2xl overflow-hidden relative">
            {/* Decorative sparkles */}
            <div className="absolute top-4 right-4 text-yellow-400 animate-pulse">
              <Sparkles className="h-6 w-6" />
            </div>
            <div className="absolute top-8 left-6 text-yellow-300 animate-pulse" style={{ animationDelay: '0.5s' }}>
              <Sparkles className="h-4 w-4" />
            </div>
            <div className="absolute bottom-6 right-8 text-yellow-400 animate-pulse" style={{ animationDelay: '1s' }}>
              <Sparkles className="h-5 w-5" />
            </div>

            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500 text-white rounded-full mb-4 animate-bounce">
                <Heart className="h-8 w-8" />
              </div>
              <h2 className="text-3xl font-bold text-green-800 mb-2 tracking-tight">
                Thank You!
              </h2>
              <p className="text-green-700 font-medium">
                Your donation helps preserve linguistic heritage
              </p>
            </div>

            <div className="bg-white/80 rounded-xl p-6 mb-6 border border-green-100 relative">
              <Quote className="h-6 w-6 text-green-600 mb-3 opacity-60" />
              <blockquote className="text-gray-700 text-center leading-relaxed mb-4">
                <p className="text-lg font-medium italic mb-3">
                  "Every language is a temple, in which the soul of those who speak it is enshrined."
                </p>
                <footer className="text-sm text-gray-600 font-medium">
                  — Oliver Wendell Holmes, Sr.
                </footer>
              </blockquote>
            </div>

            <div className="text-center text-sm text-green-700 mb-6">
              <p className="font-medium">🌱 With Language Garden, we nurture every linguistic temple</p>
            </div>

            <Button
              ref={closeBtnRef}
              onClick={onClose}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium"
            >
              Continue Exploring
            </Button>

            <p className="text-xs text-center text-green-600 mt-3 opacity-75">
              This window will close automatically in a few seconds
            </p>
          </Card>
        </div>
      </div>
    </ModalPortal>
  );
}