import { useState, useEffect } from 'react';
import * as Location from 'expo-location';

const ORS_API_KEY = process.env.EXPO_PUBLIC_DIRECTION_API_KEY;

export function useLocation() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [locationName, setLocationName] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);

      // let address = await Location.reverseGeocodeAsync({
      //   latitude: location.coords.latitude,
      //   longitude: location.coords.longitude
      // });
      // console.log('Address: ', address);

      if (location) {
        const { latitude, longitude } = location.coords;
        try {
          const response = await fetch(
            `https://api.openrouteservice.org/geocode/reverse?api_key=${ORS_API_KEY}&point.lat=${latitude}&point.lon=${longitude}&size=1`,
            {
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
              }
            }
          );

          const data = await response.json();
          if (data.features && data.features.length > 0) {
            setLocationName(data.features[0].properties.label);
          } else {
            setLocationName('Unknown location');
          }
        } catch (error) {
          console.error('Error fetching location name:', error);
          setLocationName('Error fetching location name');
        }
      }

    })();
  }, []);

  return { location, errorMsg, locationName };
}