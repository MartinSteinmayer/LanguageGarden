"use client";

import { useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { X, Info } from "lucide-react";
import ModalPortal from "./ModalPortal";

export default function UNESCOInfoModal({ onClose }) {
  const closeBtnRef = useRef(null);

  // Close on ESC
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  // Focus management
  useEffect(() => {
    closeBtnRef.current?.focus();
  }, []);

  const categories = [
    { code: 'EX', label: 'Extinct', color: 'bg-gray-600', description: 'There are no speakers left. The Atlas presumes extinction if there have been no fluent speakers since the 1950s.' },
    { code: 'CR', label: 'Critically Endangered', color: 'bg-red-600', description: 'The youngest speakers are grandparents and older, and they speak the language only partially and infrequently.' },
    { code: 'SE', label: 'Severely Endangered', color: 'bg-red-500', description: 'Language is spoken by grandparents and older generations; while the parent generation may understand it, they do not speak it to children or among themselves.' },
    { code: 'DE', label: 'Definitely Endangered', color: 'bg-amber-500', description: 'Children no longer learn the language as mother tongue in the home.' },
    { code: 'VU', label: 'Vulnerable', color: 'bg-yellow-400', description: 'Most children speak the language, but it may be restricted to certain domains.' },
    { code: 'NE', label: 'Not Endangered', color: 'bg-green-500', description: 'Language is spoken by all generations and intergenerational transmission is uninterrupted.' }
  ];

  return (
    <ModalPortal>
      <div
        className="fixed inset-0 z-[999] flex items-center justify-center p-4"
        aria-modal="true"
        role="dialog"
      >
        <div
          className="absolute inset-0 bg-black/65 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={onClose}
        />
        <div className="relative w-full max-w-2xl origin-center animate-in fade-in zoom-in-95 duration-200">
          <Card className="p-6 bg-white/95 border border-white/60 shadow-2xl rounded-xl max-h-[90vh] overflow-y-auto">
            <button
              ref={closeBtnRef}
              onClick={onClose}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded"
              aria-label="Close UNESCO info modal"
            >
              <X className="h-5 w-5" />
            </button>
            
            <div className="mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2 tracking-tight mb-2">
                <Info className="h-6 w-6 text-blue-500" />
                UNESCO Language Vitality Scale
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                The UNESCO Atlas of the World's Languages in Danger uses a standardized classification system 
                to assess language endangerment levels based on intergenerational transmission patterns.
              </p>
            </div>

            {/* Visual Scale Diagram */}
            <div className="mb-6 p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 text-center">Endangerment Scale</h3>
              <div className="flex rounded-lg overflow-hidden shadow-sm mb-2">
                {categories.map((cat) => (
                  <div key={cat.code} className={`flex-1 h-10 ${cat.color} flex items-center justify-center text-white text-xs font-bold`}>
                    {cat.code}
                  </div>
                ))}
              </div>
              {/* Simple gray bar below */}
              <div className="h-1 bg-gray-300 rounded-full mb-2"></div>
              <div className="flex justify-between text-xs text-gray-600">
                <span>Extinct</span>
                <span>Safe</span>
              </div>
            </div>

            <Separator className="my-4" />

            {/* Category Explanations */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Classification Details</h3>
              
              {categories.map((category) => (
                <div key={category.code} className="flex gap-3 p-3 rounded-lg bg-gray-50/50">
                  <div className={`w-8 h-8 ${category.color} rounded-md flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                    {category.code}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm text-gray-800 mb-1">{category.label}</h4>
                    <p className="text-xs text-gray-600 leading-relaxed">{category.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <Separator className="my-6" />

            <div className="bg-blue-50 rounded-lg p-4 mb-4">
              <h3 className="text-sm font-semibold text-blue-800 mb-2">Language Garden Focus</h3>
              <p className="text-xs text-blue-700 leading-relaxed">
                Our platform prioritizes languages in the <strong>Severely Endangered (SE)</strong> and <strong>Definitely Endangered (DE)</strong> 
                categories, where urgent action is needed to preserve linguistic heritage. Voice-enabled languages show our progress 
                in making these languages accessible for learning and cultural transmission.
              </p>
            </div>

            <div className="flex justify-end">
              <Button onClick={onClose} className="bg-blue-600 hover:bg-blue-700">
                Got it!
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </ModalPortal>
  );
}