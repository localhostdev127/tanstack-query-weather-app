import { useState, useEffect } from "react";
import type { Coordinates } from "@/api/types";
import { Bounce, toast } from "react-toastify";

interface GeolocationState {
  coordinates: Coordinates | null;
  error: string | null;
  isLoading: boolean;
}

// default location for permision denied
const fallbackcords = {
  "lat": 22.5414185,
  "lon": 88.35769124388872
}

export function useGeolocation() {
  const [locationData, setLocationData] = useState<GeolocationState>({
    coordinates: null,
    error: null,
    isLoading: true,
  });

  const getLocation = () => {
    setLocationData((prev) => ({ ...prev, isLoading: true, error: null }));

    if (!navigator.geolocation) {
      setLocationData({
        coordinates: null,
        error: "Geolocation is not supported by your browser",
        isLoading: false,
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocationData({
          coordinates: {
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          },
          error: null,
          isLoading: false,
        });
      },
      (error) => {
        let errorMessage: string;
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage =
              "Location permission denied. Please enable location access.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable.";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out.";
            break;
          default:
            errorMessage = "An unknown error occurred.";
        }
        // adding a fallback location incase of permision denied
        const notify = () => toast.error(errorMessage, {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Bounce,
          });
        if (error.code === error.PERMISSION_DENIED) {
          notify();
          setLocationData({
            coordinates:fallbackcords,
            error: null,
            isLoading: false,
          });
        } else {
          setLocationData({
            coordinates: null,
            error: errorMessage,
            isLoading: false,
          });
        }

      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  };

  // Get location on component mount
  useEffect(() => {
    getLocation();
  }, []);

  return {
    ...locationData,
    getLocation, // Expose method to manually refresh location
  };
}
