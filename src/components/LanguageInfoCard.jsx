"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Mic, Heart, Book, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import VoiceChat from "./VoiceChatSimple";
import DonateModal from "./DonateModal";
import ExtendedLanguageModal from "./ExtendedLanguageModal";

const LanguageInfoCard = ({ languageGroup, onClose }) => {
  if (!languageGroup) return null;
  
  // Handle both single languages and language groups
  // If it's a group, use the languages array; otherwise, treat the whole object as a single language
  let languages;
  try {
    // Parse the languages if it's a JSON string (for groups)
    languages = languageGroup.languages 
      ? (typeof languageGroup.languages === 'string' 
          ? JSON.parse(languageGroup.languages) 
          : languageGroup.languages)
      : [languageGroup];
  } catch (error) {
    console.error('Error parsing languages:', error);
    languages = [languageGroup];
  }
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showVoiceChat, setShowVoiceChat] = useState(false);
  const [showDonate, setShowDonate] = useState(false);
  const [showExtended, setShowExtended] = useState(false);
  const currentLanguage = languages[currentIndex];
  const hasMultiple = languages.length > 1;
  
  // Additional safety check - if currentLanguage is undefined, don't render
  if (!currentLanguage) {
    console.error('Current language is undefined:', { languageGroup, languages, currentIndex });
    return null;
  }
  
  const navigateLanguage = (direction) => {
    if (direction === 'next') {
      setCurrentIndex((prev) => (prev + 1) % languages.length);
    } else {
      setCurrentIndex((prev) => (prev - 1 + languages.length) % languages.length);
    }
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 'voice':
        return {
          badge: 'Voice Chat Available',
          color: 'bg-green-500',
          icon: <Mic className="h-4 w-4" />,
          buttonText: 'Start Voice Chat',
          buttonVariant: 'default'
        };
      case 'endangered':
        return {
          badge: 'Endangered Language',
          color: 'bg-amber-500',
          icon: <Heart className="h-4 w-4" />,
          buttonText: 'Help Preserve Language',
          buttonVariant: 'outline'
        };
      default: // 'severely_endangered' or any other status
        return {
          badge: 'Severely Endangered',
          color: 'bg-red-500',
          icon: <Heart className="h-4 w-4" />,
          buttonText: 'Help Preserve (High Priority)',
          buttonVariant: 'outline'
        };
    }
  };

  const statusConfig = getStatusConfig(currentLanguage.status || 'severely_endangered');

  return (
    <Card className="w-80 shadow-lg border-0 bg-white/95 backdrop-blur-sm animate-in slide-in-from-right-5 duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
            <div className="flex flex-col">
                <CardTitle className="text-xl font-bold">{currentLanguage.name}</CardTitle>
                <p className="text-xs text-gray-700 font-semibold w-fit">{currentLanguage.officialName}</p>
            </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl font-semibold"
          >
            ×
          </button>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className={`${statusConfig.color} text-white`}>
              {statusConfig.badge}
            </Badge>
          </div>
          
          {/* Navigation controls for multiple languages */}
          {hasMultiple && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">
                {currentIndex + 1} of {languageGroup.languageCount || languages.length}
              </span>
              <div className="flex gap-1">
                <button
                  onClick={() => navigateLanguage('prev')}
                  className="h-6 w-6 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors"
                  disabled={languages.length <= 1}
                >
                  <ChevronLeft className="h-3 w-3" />
                </button>
                <button
                  onClick={() => navigateLanguage('next')}
                  className="h-6 w-6 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors"
                  disabled={languages.length <= 1}
                >
                  <ChevronRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <CardDescription className="text-sm text-gray-600">
          {currentLanguage.description && currentLanguage.description.length > 300 ? (
            <>
              {(() => {
                const truncated = currentLanguage.description.substring(0, 300);
                const lastSpaceIndex = truncated.lastIndexOf(' ');
                return lastSpaceIndex > 0 ? truncated.substring(0, lastSpaceIndex) : truncated;
              })()}
              <button
                onClick={() => setShowExtended(true)}
                className="text-blue-600 hover:text-blue-800 font-medium cursor-pointer ml-1 transition-colors"
              >
                ...
              </button>
            </>
          ) : (
            currentLanguage.description
          )}
        </CardDescription>
        
        <Separator />
        
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="font-medium text-gray-700">Speakers:</span>
            <span className="font-semibold">
              {currentLanguage.speakers?.toLocaleString()}
            </span>
          </div>
          
          {currentLanguage.countryName && (
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Country:</span>
              <span>{currentLanguage.countryName}</span>
            </div>
          )}
        </div>
        
        {/* Show multiple languages indicator */}
        {hasMultiple && (
          <>
            <Separator />
            <div className="text-xs text-gray-500 text-center bg-gray-50 rounded-lg p-2">
              📍 This location has {languageGroup.languageCount || languages.length} languages. Use the arrows above to explore them all.
            </div>
          </>
        )}
        
        <Separator />
        <div className="flex flex-col gap-2">
          <Button 
            className={`w-full ${statusConfig.color} cursor-pointer ${
              currentLanguage.status !== 'voice' ? 'text-white hover:text-black' : ''
            }`}
            variant={statusConfig.buttonVariant}
            onClick={() => {
              if (currentLanguage.status === 'voice') {
                setShowVoiceChat(true);
              } else {
                setShowDonate(true); // Open donation modal
              }
            }}
          >
            <span className="flex items-center gap-2">
              {statusConfig.icon}
              {statusConfig.buttonText}
            </span>
          </Button>
          <Button
            variant="outline"
            className="w-full text-xs"
            onClick={() => setShowExtended(true)}
          >
            Learn More
          </Button>
        </div>
      </CardContent>
      
      {/* Voice Chat Modal */}
      {showVoiceChat && (
        <VoiceChat 
          language={currentLanguage}
          onClose={() => setShowVoiceChat(false)}
        />
      )}
      {showDonate && (
        <DonateModal
          language={currentLanguage}
            onClose={() => setShowDonate(false)}
        />
      )}
      {showExtended && (
        <ExtendedLanguageModal
          languageGroup={languageGroup}
          currentIndex={currentIndex}
          onSelectIndex={(i) => setCurrentIndex(i)}
          onClose={() => setShowExtended(false)}
        />
      )}
    </Card>
  );
};

export default LanguageInfoCard;