// RouteMap.js
import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';

const RouteMap = ({ userLocation, destination, walkingPoints }: {
  userLocation: { latitude: number; longitude: number; } | null; destination: any; walkingPoints?: {
    start: { latitude: number; longitude: number };
    end: { latitude: number; longitude: number };
  }[];
}) => {
  const [currentLocation, setCurrentLocation] = useState<{ latitude: number; longitude: number }>();
  const [routeCoordinates, setRouteCoordinates] = useState<{ latitude: number; longitude: number }[]>([]);
  const [walkingRoutes, setWalkingRoutes] = useState<{ latitude: number; longitude: number }[]>([]);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  useEffect(() => {
    const getRoute = async () => {
      if (currentLocation && destination) {
        const nrouteCoordinates = await calculateRoute(currentLocation, destination);
        if (nrouteCoordinates) {
          setRouteCoordinates(nrouteCoordinates);
        }
      }
    };
    getRoute();
  }, [currentLocation, destination]);

  useEffect(() => {
    const getWalkingRoutes = async () => {
      if (walkingPoints && walkingPoints.length > 0) {
        for (const point of walkingPoints) {
          const walkRoute = await calculateRoute(point.start, point.end);
          if (walkRoute) {
            setWalkingRoutes(prev => [...prev, ...walkRoute]);
          }
        }
      }
    };
    getWalkingRoutes();
  }, [walkingPoints]);

  const getCurrentLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setCurrentLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    } catch (error) {
      console.error('Error getting current location:', error);
    }
  };

  const calculateRoute = async (currentLocation: { latitude: number; longitude: number }, destination: { latitude: number; longitude: number }) => {
    const apiKey = process.env.EXPO_PUBLIC_DIRECTION_API_KEY;
    const apiUrl = process.env.EXPO_PUBLIC_DIRECTION_API_URL;

    try {
      if (!currentLocation) {
        console.error('Current location is null');
        return;
      }
      const response = await fetch(`${apiUrl}?api_key=${apiKey}&start=${currentLocation.longitude},${currentLocation.latitude}&end=${destination.longitude},${destination.latitude}`);

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      if (data.features && data.features.length > 0) {
        const routeGeometry = data.features[0].geometry.coordinates;
        const newRouteCoordinates = routeGeometry.map((coord: [number, number]) => ({
          longitude: coord[0],
          latitude: coord[1]
        }));
        return newRouteCoordinates;
      } else {
        console.error('No route found');
        fallbackToStraightLine();
      }
    } catch (error) {
      console.error('Error calculating route:', error);
      fallbackToStraightLine();
    }
  };

  const fallbackToStraightLine = () => {
    if (!currentLocation) {
      console.error('Current location is null');
      return;
    }
    const newRouteCoordinates = [
      { latitude: currentLocation.latitude, longitude: currentLocation.longitude },
      { latitude: destination.latitude, longitude: destination.longitude },
    ];
    setRouteCoordinates(newRouteCoordinates);
  };

  if (!currentLocation) {
    return null;
  }

  return (
    <MapView
      style={styles.map}
      provider={PROVIDER_GOOGLE}
      initialRegion={{
        ...currentLocation,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }}
    >
      <Marker
        coordinate={currentLocation}
        title="Current Location"
        pinColor="#57BE5E"
      />

      {destination && (
        <Marker
          coordinate={{
            latitude: destination.latitude,
            longitude: destination.longitude,
          }}
          title={destination.name}
          pinColor="red"
        />
      )}
      {routeCoordinates.length > 0 && (
        <Polyline
          coordinates={routeCoordinates}
          strokeColor="#3344FF"
          strokeWidth={3}
        />
      )}

      {walkingRoutes.length > 0 && (
        <Polyline
          coordinates={walkingRoutes}
          strokeColor="#8888FF"
          strokeWidth={4}
          lineDashPattern={[5, 5]}
        />
      )}

      {walkingRoutes.length > 0 && (
        <Marker
          coordinate={walkingRoutes[0]}
          title="Walking Start"
          pinColor="#8888FF"
        />
      )}
    </MapView>
  );
};

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default RouteMap;