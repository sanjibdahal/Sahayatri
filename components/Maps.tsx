import { View } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { useLocation } from '@/hooks/useLocation';
import RouteMap from '@/app/(root)/RouteMap';

type Props = {
  sourceLocation: { latitude: number; longitude: number };
  onLocationSelect?: (location: { latitude: number; longitude: number }) => void;
  destinationLocation?: { latitude: number; longitude: number } | null;
  walkingPoints?: {
    start: { latitude: number; longitude: number };
    end: { latitude: number; longitude: number };
  }[];
};

export default function Maps({ sourceLocation, onLocationSelect, destinationLocation, walkingPoints }: Props) {
  const { location } = useLocation();
  // console.log('Current Location: ', location);

  const defaultRegion = {
    latitude: sourceLocation?.latitude || location?.coords.latitude || 27.7172,
    longitude: destinationLocation?.longitude || location?.coords.longitude || 85.3240,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  return (
    <View className="flex-1 h-96 w-full">
      <MapView
        provider={PROVIDER_GOOGLE}
        style={{ flex: 1 }}
        initialRegion={defaultRegion}
        onPress={(e) => onLocationSelect?.(e.nativeEvent.coordinate)}
      >
        {sourceLocation && (
          <Marker
            coordinate={sourceLocation}
            pinColor="#57BE5E"
          />
        )}
      </MapView>
      <RouteMap
        userLocation={sourceLocation}
        destination={destinationLocation}
      />

      {walkingPoints?.map((points, index) => (
        <Polyline
          key={index}
          coordinates={[points.start, points.end]}
          strokeColor="#57BE5E"
          strokeWidth={2}
          lineDashPattern={[5, 5]}
        />
      ))}
    </View>
  );
}