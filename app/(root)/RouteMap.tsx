// RouteMap.js
import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';

const RouteMap = ({ userLocation, destination }: { userLocation: { latitude: number; longitude: number; }; destination: any }) => {
  const [currentLocation, setCurrentLocation] = useState<{ latitude: number; longitude: number } >();
  const [routeCoordinates, setRouteCoordinates] = useState<{ latitude: number; longitude: number }[]>([]);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  useEffect(() => {
    if (currentLocation && destination) {
      calculateRoute();
    }
  }, [currentLocation, destination]);

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

  const calculateRoute = async () => {
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
        setRouteCoordinates(newRouteCoordinates);
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
        pinColor="blue"
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
    </MapView>
  );
};

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default RouteMap;