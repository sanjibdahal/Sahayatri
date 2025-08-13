import { View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
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

  const defaultRegion = {
    latitude: sourceLocation?.latitude || location?.coords.latitude || 27.7172,
    longitude: sourceLocation?.longitude || location?.coords.longitude || 85.3240,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  return (
    <View style={{ height: 384, width: '100%' }}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={{ flex: 1 }}
        initialRegion={defaultRegion}
        onPress={(e) => onLocationSelect?.(e.nativeEvent.coordinate)}
      >
        {/* Marker for source */}
        <Marker
          coordinate={{
            latitude: sourceLocation?.latitude || defaultRegion.latitude,
            longitude: sourceLocation?.longitude || defaultRegion.longitude,
          }}
          title="Source"
          pinColor="#57BE5E"
        />
        {/* Marker for destination */}
        {destinationLocation && (
          <Marker
            coordinate={{
              latitude: destinationLocation.latitude,
              longitude: destinationLocation.longitude,
            }}
            title="Destination"
            pinColor="red"
          />
        )}
      </MapView>
      {/* RouteMap overlays the route, not the map itself */}
      <RouteMap
        userLocation={sourceLocation}
        destination={destinationLocation}
        walkingPoints={walkingPoints}
      />
    </View>
  );
}