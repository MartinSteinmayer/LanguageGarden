"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mic, Book, Heart } from "lucide-react";

const MapLegend = () => {
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
    <Card className="w-64 shadow-lg border-0 bg-white backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-bold text-gray-800">
          Language Status
        </CardTitle>
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
    </Card>
  );
};

export default MapLegend;