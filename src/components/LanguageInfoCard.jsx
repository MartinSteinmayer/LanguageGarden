"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Mic, Heart, Book, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import VoiceChat from "./VoiceChatSimple";

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
  const currentLanguage = languages[currentIndex];
  const hasMultiple = languages.length > 1;
  
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
          badge: 'Voice Chat + History',
          color: 'bg-green-500',
          icon: <Mic className="h-4 w-4" />,
          buttonText: 'Start Voice Chat',
          buttonVariant: 'default'
        };
      default: // 'history' or any other status
        return {
          badge: 'History Only',
          color: 'bg-red-500',
          icon: <Heart className="h-4 w-4" />,
          buttonText: 'Learn & Fund Voice',
          buttonVariant: 'outline'
        };
    }
  };

  const statusConfig = getStatusConfig(currentLanguage.status);

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
          {currentLanguage.description}
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
          
          {currentLanguage.voiceCount && (
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Voices:</span>
              <span>{currentLanguage.voiceCount}</span>
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
        
        <Button 
          className={`w-full ${statusConfig.color} cursor-pointer`}
          variant={statusConfig.buttonVariant}
          onClick={() => {
            if (currentLanguage.status === 'voice') {
              setShowVoiceChat(true);
            } else {
              console.log('Opening donation for', currentLanguage.name);
              // Implement donation logic
            }
          }}
        >
          <span className="flex items-center gap-2">
            {statusConfig.icon}
            {statusConfig.buttonText}
          </span>
        </Button>
        
        {currentLanguage.status !== 'voice' && (
          <p className="text-xs text-gray-500 text-center">
            Help bring voice chat to {currentLanguage.name} speakers worldwide
          </p>
        )}
      </CardContent>
      
      {/* Voice Chat Modal */}
      {showVoiceChat && (
        <VoiceChat 
          language={currentLanguage}
          onClose={() => setShowVoiceChat(false)}
        />
      )}
    </Card>
  );
};

export default LanguageInfoCard;