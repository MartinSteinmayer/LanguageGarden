"use client";

import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { X, Heart, ShieldCheck } from "lucide-react";
import ModalPortal from "./ModalPortal";
import ThankYouModal from "./ThankYouModal";

// Simple placeholder donation modal. Later you can swap the handleDonate logic
// for Stripe Checkout, Payment Links, or a server route that creates a Checkout Session.
const presetAmounts = [5, 15, 25, 50, 100];

export default function DonateModal({ language, onClose }) {
  const [selectedAmount, setSelectedAmount] = useState(25);
  const [customAmount, setCustomAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const closeBtnRef = useRef(null);

  const amount = customAmount ? Number(customAmount) : selectedAmount;
  const isValid = amount > 0 && !Number.isNaN(amount);

  // Close on ESC
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  // Basic focus handling
  useEffect(() => {
    closeBtnRef.current?.focus();
  }, []);

  const handleDonate = async () => {
    if (!isValid) return;
    setLoading(true);
    try {
      // Placeholder: Replace with Stripe Payment Link or Checkout Session creation.
      // Example (Payment Link): window.location.href = "https://buy.stripe.com/xyz";
      // Example (Checkout Session):
      // const res = await fetch("/api/create-checkout", { method: "POST", body: JSON.stringify({ amount, language }) });
      // const { url } = await res.json(); window.location.href = url;
      console.log("Simulated donation:", { amount, iso: language?.iso6393, name: language?.name });
      
      // Simulate a brief delay for payment processing
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show thank you modal instead of just closing
      setShowThankYou(true);
    } catch (e) {
      console.error("Donate error", e);
    } finally {
      setLoading(false);
    }
  };

  // Handle thank you modal close
  const handleThankYouClose = () => {
    setShowThankYou(false);
    onClose();
  };

  return (
    <>
      {showThankYou && <ThankYouModal onClose={handleThankYouClose} />}
      
      {!showThankYou && (
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
        <div className="relative w-full max-w-md origin-center animate-in fade-in zoom-in-95 duration-200">
          <Card className="p-6 bg-white/95 border border-white/60 shadow-2xl rounded-xl">
            <button
              ref={closeBtnRef}
              onClick={onClose}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-red-400 rounded"
              aria-label="Close donation modal"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="mb-5">
              <h2 className="text-2xl font-bold flex items-center gap-2 tracking-tight">
                <Heart className="h-6 w-6 text-red-500" />
                Preserve {language?.name}
              </h2>
              <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                Your donation directly supports critical language preservation efforts: digital archiving,
                community speaker programs, educational resources, and AI voice model development.
                Help save this
                {" "}
                <span className="font-medium text-red-600">
                  {language?.status === 'endangered' ? 'endangered' : 'severely endangered'}
                </span>{" "}
                language from disappearing forever.
              </p>
              <p className="text-xs text-gray-500 mt-3">
                Done in partnership with <a href="https://elevenlabs.io/about" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline font-medium">ElevenLabs</a>
              </p>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {presetAmounts.map(a => (
                <button
                  key={a}
                  onClick={() => { setSelectedAmount(a); setCustomAmount(""); }}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium border transition-all focus:outline-none focus:ring-2 focus:ring-red-400 ${
                    !customAmount && selectedAmount === a ? 'bg-red-500 text-white border-red-500 shadow' : 'bg-white hover:bg-red-50 border-gray-200'
                  }`}
                >
                  ${a}
                </button>
              ))}
            </div>

            <div className="mb-5">
              <label className="block text-xs font-semibold text-gray-600 mb-1">Custom amount</label>
              <div className="flex items-center gap-2">
                <span className="text-gray-500 text-sm">$</span>
                <input
                  type="number"
                  min="1"
                  placeholder="Other"
                  className="w-full text-sm rounded-md border border-gray-300 px-2 py-2 focus:outline-none focus:ring-2 focus:ring-red-400 bg-white/80"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                />
              </div>
            </div>

            <Separator className="my-5" />

            <div className="space-y-3 text-sm text-gray-600 mb-6">
              <div className="flex items-start gap-3"><ShieldCheck className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" /><span>100% directed to preservation efforts, documentation projects, and voice AI development with ElevenLabs.</span></div>
              <div className="flex items-start gap-3"><Heart className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" /><span>Every dollar helps train native speakers, digitize oral histories, and create learning materials.</span></div>
              <div className="flex items-start gap-3"><ShieldCheck className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" /><span>Transparent public milestone tracking with community impact reports.</span></div>
            </div>

            <Button
              disabled={!isValid || loading}
              onClick={handleDonate}
              className="w-full bg-red-500 hover:bg-red-600"
            >
              {loading ? 'Processing...' : `Donate $${amount}`}
            </Button>
          </Card>
        </div>
      </div>
    </ModalPortal>
      )}
    </>
  );
}
