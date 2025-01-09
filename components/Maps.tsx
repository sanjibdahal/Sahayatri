import { View } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { useLocation } from '@/hooks/useLocation';
import RouteMap from '@/components/RouteMap';

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
      </MapView>
      <RouteMap
        userLocation={sourceLocation}
        destination={destinationLocation}
        walkingPoints={walkingPoints}
      />

      
    </View>
  );
}