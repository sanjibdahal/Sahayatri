import { View, Text } from 'react-native';
import { useState } from 'react';
import { useLocation } from '@/hooks/useLocation';
import Maps from './Maps';

interface Location {
  latitude: number;
  longitude: number;
  name?: string;
}

type Props = {
  title: string;
  onLocationSelect: (location: Location) => void;
};

export default function LocationPicker({ title, onLocationSelect }: Props) {
  const { location } = useLocation();
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

  const handleLocationSelect = (location: Location) => {
    setSelectedLocation(location);
    onLocationSelect(location);
  };

  return (
    <View className="mt-4">
      <Text className="text-lg font-plusjakartasans mb-2">{title}</Text>
      <View className="h-48 rounded-lg overflow-hidden">
        <Maps
          initialLocation={location?.coords}
          onLocationSelect={handleLocationSelect}
          selectedLocation={selectedLocation}
        />
      </View>
    </View>
  );
}