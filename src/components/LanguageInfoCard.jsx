"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Mic, Heart, Book } from "lucide-react";

const LanguageInfoCard = ({ language, onClose }) => {
  if (!language) return null;

  const getStatusConfig = (status) => {
    switch (status) {
      case 'voice':
        return {
          badge: 'Voice Available',
          color: 'bg-green-500',
          icon: <Mic className="h-4 w-4" />,
          buttonText: 'Start Voice Chat',
          buttonVariant: 'default'
        };
      case 'history':
        return {
          badge: 'History Available',
          color: 'bg-yellow-500',
          icon: <Book className="h-4 w-4" />,
          buttonText: 'Donate for Voice',
          buttonVariant: 'outline'
        };
      default:
        return {
          badge: 'Needs Funding',
          color: 'bg-red-500',
          icon: <Heart className="h-4 w-4" />,
          buttonText: 'Donate to Fund',
          buttonVariant: 'outline'
        };
    }
  };

  const statusConfig = getStatusConfig(language.status);

  return (
    <Card className="w-80 shadow-lg border-0 bg-white/95 backdrop-blur-sm animate-in slide-in-from-right-5 duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold">{language.name}</CardTitle>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl font-semibold"
          >
            ×
          </button>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className={`${statusConfig.color} text-white`}>
            {statusConfig.badge}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <CardDescription className="text-sm text-gray-600">
          {language.description}
        </CardDescription>
        
        <Separator />
        
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="font-medium text-gray-700">Speakers:</span>
            <span className="font-semibold">
              {language.speakers?.toLocaleString()}
            </span>
          </div>
          
          {language.countryName && (
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Country:</span>
              <span>{language.countryName}</span>
            </div>
          )}
        </div>
        
        <Separator />
        
        <Button 
          className={`w-full ${statusConfig.color} cursor-pointer`}
          variant={statusConfig.buttonVariant}
          onClick={() => {
            if (language.status === 'voice') {
              console.log('Starting voice chat for', language.name);
              // Implement voice chat logic
            } else {
              console.log('Opening donation for', language.name);
              // Implement donation logic
            }
          }}
        >
          <span className="flex items-center gap-2">
            {statusConfig.icon}
            {statusConfig.buttonText}
          </span>
        </Button>
        
        {language.status !== 'voice' && (
          <p className="text-xs text-gray-500 text-center">
            Help bring voice chat to {language.name} speakers worldwide
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default LanguageInfoCard;
