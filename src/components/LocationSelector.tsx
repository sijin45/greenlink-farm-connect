
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const LocationSelector = () => {
  const { t } = useTranslation();
  const [location, setLocation] = useState<string>("");
  const [isDetecting, setIsDetecting] = useState(false);

  const detectLocation = () => {
    setIsDetecting(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            // Using a simple reverse geocoding service (you might want to use a proper API key in production)
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}`
            );
            const data = await response.json();
            const city = data.address?.city || data.address?.town || data.address?.village || "Unknown Location";
            setLocation(city);
          } catch (error) {
            console.error("Error getting location name:", error);
            setLocation("Location detected");
          }
          setIsDetecting(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setLocation(t("location.failed"));
          setIsDetecting(false);
        }
      );
    } else {
      setLocation(t("location.failed"));
      setIsDetecting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="text-white hover:text-green-200">
          <MapPin className="h-4 w-4 mr-1" />
          {isDetecting ? t("location.detecting") : location || t("location.current")}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="mt-2 bg-white">
        <DropdownMenuItem onClick={detectLocation} disabled={isDetecting}>
          {isDetecting ? t("location.detecting") : t("location.current")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
