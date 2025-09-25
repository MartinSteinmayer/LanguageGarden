"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mic, Book, Heart, Info } from "lucide-react";
import { useState } from "react";
import UNESCOInfoModal from "./UNESCOInfoModal";

const MapLegend = () => {
  const [showUNESCOInfo, setShowUNESCOInfo] = useState(false);
  
  const legendItems = [
    {
      icon: <Mic className="h-3 w-3" />,
      label: "Voice Available",
      color: "bg-green-500",
      description: "Chat & learn culture"
    },
    {
      icon: <Heart className="h-3 w-3" />,
      label: "Endangered",
      color: "bg-amber-500",
      description: "Help preserve language"
    },
    {
      icon: <Heart className="h-3 w-3" />,
      label: "Severely Endangered",
      color: "bg-red-500",
      description: "Urgent preservation needed"
    }
  ];

  return (
    <Card className="w-64 shadow-lg border-0 bg-white backdrop-blur-sm gap-0">
      <CardHeader className="md:pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold text-gray-800">
            Language Status
          </CardTitle>
          <button
            onClick={() => setShowUNESCOInfo(true)}
            className="text-gray-400 hover:text-blue-600 transition-colors p-1 rounded-full hover:bg-blue-50"
            aria-label="Learn about UNESCO language classification"
          >
            <Info className="h-4 w-4" />
          </button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {legendItems.map((item, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className={`w-4 h-4 rounded-full ${item.color} flex items-center justify-center`}>
              <span className="text-white text-xs">
                {item.icon}
              </span>
            </div>
            <div className="flex-1">
              <div className="font-medium text-sm text-gray-800">
                {item.label}
              </div>
              <div className="text-xs text-gray-500">
                {item.description}
              </div>
            </div>
          </div>
        ))}
        
        <div className="pt-2 border-t">
          <p className="text-xs text-gray-500 text-center">
            Click any language dot to learn more
          </p>
        </div>
      </CardContent>
      
      {/* UNESCO Info Modal */}
      {showUNESCOInfo && (
        <UNESCOInfoModal onClose={() => setShowUNESCOInfo(false)} />
      )}
    </Card>
  );
};

export default MapLegend;