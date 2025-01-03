import { View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { useLocation } from '@/hooks/useLocation';

type Props = {
  initialLocation?: { latitude: number; longitude: number };
  onLocationSelect?: (location: { latitude: number; longitude: number }) => void;
  selectedLocation?: { latitude: number; longitude: number } | null;
};

export default function Maps({ initialLocation, onLocationSelect, selectedLocation }: Props) {
  const { location } = useLocation();
  console.log('Current Location: ', location);

  const defaultRegion = {
    latitude: initialLocation?.latitude || location?.coords.latitude || 27.7172,
    longitude: initialLocation?.longitude || location?.coords.longitude || 85.3240,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  return (
    <View className="flex-1">
      <MapView
        provider={PROVIDER_GOOGLE}
        style={{ flex: 1 }}
        initialRegion={defaultRegion}
        onPress={(e) => onLocationSelect?.(e.nativeEvent.coordinate)}
      >
        {selectedLocation && (
          <Marker
            coordinate={selectedLocation}
            pinColor="#57BE5E"
          />
        )}
      </MapView>
    </View>
  );
}