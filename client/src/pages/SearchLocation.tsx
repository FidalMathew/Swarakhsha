import {
  Autocomplete,
  DirectionsRenderer,
  GoogleMap,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";
import { useEffect, useRef, useState } from "react";
import Nav from "../components/Nav";

// Type definitions
interface CustomDestination {
  lat: number;
  lng: number;
  name: string;
  address?: string;
}

interface HarassmentIncident {
  id: number;
  lat: number;
  lng: number;
  severity: "high" | "medium" | "low";
  date: string;
  type?: string;
  timeOfDay?: "morning" | "afternoon" | "evening" | "night";
  reportedBy?: string;
}

interface SafeRoute extends google.maps.DirectionsRoute {
  isSafe: boolean;
  name: string;
  originalIndex: number;
  optionIndex: number;
}

interface RouteOption {
  name: string;
  config: google.maps.DirectionsRequest;
}

interface SafetySettings {
  safetyMode: boolean;
  showIncidents: boolean;
  safetyBuffer: number;
}

// Sample harassment incident data - replace with your actual dataset
const harassmentIncidents: HarassmentIncident[] = [
  {
    id: 1,
    lat: 28.7041,
    lng: 77.1025,
    severity: "high",
    date: "2024-01-15",
    timeOfDay: "evening",
  },
  {
    id: 2,
    lat: 28.5355,
    lng: 77.291,
    severity: "medium",
    date: "2024-02-10",
    timeOfDay: "night",
  },
  {
    id: 3,
    lat: 28.52,
    lng: 77.28,
    severity: "high",
    date: "2024-01-20",
    timeOfDay: "afternoon",
  },
  {
    id: 4,
    lat: 28.54,
    lng: 77.3,
    severity: "low",
    date: "2024-03-01",
    timeOfDay: "morning",
  },
];

const MyMap: React.FC = () => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string,
    libraries: ["places", "geometry"],
  });

  const [currentLocation, setCurrentLocation] =
    useState<google.maps.LatLngLiteral | null>(null);
  const [mapCenter, setMapCenter] = useState<google.maps.LatLngLiteral>({
    lat: 28.7041,
    lng: 77.1025,
  });
  const [selectedDestination, setSelectedDestination] =
    useState<CustomDestination | null>(null);
  const [directions, setDirections] =
    useState<google.maps.DirectionsResult | null>(null);
  const [safetySettings, setSafetySettings] = useState<SafetySettings>({
    safetyMode: true,
    showIncidents: true,
    safetyBuffer: 500,
  });
  const [routeAlternatives, setRouteAlternatives] = useState<SafeRoute[]>([]);
  const [selectedRouteIndex, setSelectedRouteIndex] = useState<number>(0);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  // Get live location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc: google.maps.LatLngLiteral = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          };
          setCurrentLocation(loc);
          setMapCenter(loc);
        },
        (err) => console.error(err),
        { enableHighAccuracy: true }
      );
    }
  }, []);

  // Autocomplete handlers
  const onLoadAutocomplete = (
    autocomplete: google.maps.places.Autocomplete
  ) => {
    autocomplete.setComponentRestrictions({ country: ["IN"] });
    if (map) autocomplete.setBounds(map.getBounds()!);
    autocompleteRef.current = autocomplete;
  };

  const onPlaceChanged = () => {
    const place = autocompleteRef.current?.getPlace();
    if (!place || !place.geometry || !place.geometry.location) return;

    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();

    const newDestination: CustomDestination = {
      lat,
      lng,
      name: place.name || "Selected Location",
      address: place.formatted_address || "",
    };

    setSelectedDestination(newDestination);
    setMapCenter({ lat, lng });

    if (map) {
      map.panTo({ lat, lng });
      map.setZoom(15);
    }
  };

  // Simplified safety check (no radius, just proximity check ~100m)
  const isRouteSafe = (route: google.maps.DirectionsRoute): boolean => {
    if (!safetySettings.safetyMode || !google.maps) return true;

    const path = route.overview_path;

    for (const incident of harassmentIncidents) {
      for (const point of path) {
        const distance = google.maps.geometry.spherical.computeDistanceBetween(
          point,
          new google.maps.LatLng(incident.lat, incident.lng)
        );

        if (distance <= 100) {
          // Hard-coded small proximity
          return false;
        }
      }
    }
    return true;
  };

  // Calculate routes
  useEffect(() => {
    if (currentLocation && selectedDestination && google.maps) {
      const service = new google.maps.DirectionsService();
      const routes: SafeRoute[] = [];

      const routingOptions: RouteOption[] = [
        {
          name: "Direct Route",
          config: {
            origin: currentLocation,
            destination: {
              lat: selectedDestination.lat,
              lng: selectedDestination.lng,
            },
            travelMode: google.maps.TravelMode.WALKING,
            provideRouteAlternatives: true,
          },
        },
      ];

      let processedRoutes = 0;

      routingOptions.forEach((option, index) => {
        service.route(option.config, (result, status) => {
          if (status === "OK" && result) {
            const routesWithSafety: SafeRoute[] = result.routes.map(
              (route, routeIndex) => ({
                ...route,
                isSafe: isRouteSafe(route),
                name:
                  option.name +
                  (result.routes.length > 1
                    ? ` (Option ${routeIndex + 1})`
                    : ""),
                originalIndex: routeIndex,
                optionIndex: index,
              })
            );

            routes.push(...routesWithSafety);
          }

          processedRoutes++;
          if (processedRoutes === routingOptions.length) {
            routes.sort((a, b) => {
              if (safetySettings.safetyMode && a.isSafe !== b.isSafe) {
                return Number(b.isSafe) - Number(a.isSafe);
              }
              return a.legs[0].duration!.value - b.legs[0].duration!.value;
            });

            setRouteAlternatives(routes);
            if (routes.length > 0) {
              const selectedRoute = routes[selectedRouteIndex] || routes[0];
              if (result) {
                setDirections({
                  ...result,
                  routes: [selectedRoute],
                  request: result.request,
                });
              }
            }
          }
        });
      });
    }
  }, [
    selectedDestination,
    currentLocation,
    safetySettings.safetyMode,
    selectedRouteIndex,
  ]);

  if (!isLoaded) return <p>Loading map...</p>;

  return (
    <div className="flex flex-col h-screen">
      <Nav />
      <div className="flex flex-1 relative">
        <div className="flex-1">
          <GoogleMap
            mapContainerStyle={{ width: "100%", height: "100%" }}
            center={mapCenter}
            zoom={14}
            onLoad={(mapInstance) => setMap(mapInstance)}
          >
            {currentLocation && (
              <Marker
                position={currentLocation}
                icon={{
                  url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                }}
                title="Your Location"
              />
            )}

            {selectedDestination && (
              <Marker
                position={{
                  lat: selectedDestination.lat,
                  lng: selectedDestination.lng,
                }}
                title={selectedDestination.name}
              />
            )}

            {safetySettings.showIncidents &&
              harassmentIncidents.map((incident) => (
                <Marker
                  key={incident.id}
                  position={{ lat: incident.lat, lng: incident.lng }}
                  icon={{
                    url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
                  }}
                  title={`${incident.severity.toUpperCase()} risk incident`}
                />
              ))}

            {directions && <DirectionsRenderer directions={directions} />}
          </GoogleMap>

          {/* Autocomplete */}
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
            <Autocomplete
              onLoad={onLoadAutocomplete}
              onPlaceChanged={onPlaceChanged}
            >
              <input
                type="text"
                placeholder="Search for a destination..."
                className="px-4 py-3 text-lg bg-white/80 rounded-lg shadow-lg w-96 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </Autocomplete>
          </div>
        </div>

        {/* Sidebar remains same */}
        {/* ... */}
      </div>
    </div>
  );
};

export default MyMap;
