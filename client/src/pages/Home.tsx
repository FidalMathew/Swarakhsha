import { useEffect, useState } from "react";
import MapUI from "../components/Map";

function Home() {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [permission, setPermission] = useState<"granted" | "denied" | "prompt">(
    "prompt"
  );

  // Check location permission on mount
  useEffect(() => {
    if (navigator.permissions) {
      navigator.permissions.query({ name: "geolocation" }).then((result) => {
        setPermission(result.state);

        result.onchange = () => {
          setPermission(result.state);
        };
      });
    }
  }, []);

  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setPermission("granted");
      },
      () => {
        setPermission("denied");
      }
    );
  };

  if (permission === "denied") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h2 className="text-xl font-bold mb-2">Location Access Denied</h2>
        <p className="text-gray-600 mb-4 text-center max-w-sm">
          Please enable location permissions in your browser settings to
          continue.
        </p>
        <button
          onClick={getLocation}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (permission === "granted" && location) {
    return (
      // <div className="flex flex-col items-center justify-center min-h-screen bg-green-100">
      //   <h2 className="text-xl font-bold mb-2">Your Location</h2>
      //   <p className="text-gray-800">
      //     Latitude: {location.lat}, Longitude: {location.lng}
      //   </p>
      // </div>
      <div>
        <MapUI />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h2 className="text-xl font-bold mb-2">We need your location</h2>
      <p className="text-gray-600 mb-4">
        Click below to allow location access.
      </p>
      <button
        onClick={getLocation}
        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
      >
        Allow Location
      </button>
    </div>
  );
}

export default Home;
