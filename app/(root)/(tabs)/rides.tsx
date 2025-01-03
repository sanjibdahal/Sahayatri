import { View, Text, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { useRides } from '@/hooks/useRides';
import RideCard from '@/components/RideCard';
import { useRouter } from 'expo-router';
import { Ride } from '@/types/type';

export default function Rides() {
  const router = useRouter();
  const { fetchAvailableRides } = useRides();
  const [rides, setRides] = useState<Ride[]>([]);

  useEffect(() => {
    loadRides();
  }, []);

  const loadRides = async () => {
    try {
      const availableRides = await fetchAvailableRides();
      setRides(availableRides);
    } catch (error) {
      console.error('Error loading rides:', error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#dcdcdc]">
      <View className="p-4">
        <Text className="text-2xl font-plusjakartasans_600semibold mb-4">
          My Rides
        </Text>
        
        <FlatList
          data={rides}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <RideCard
              ride={item}
              onPress={() => {}}
              // onPress={() => router.push(`/ride/${item.id}`)}
            />
          )}
          ItemSeparatorComponent={() => <View className="h-4" />}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
}