import { View, Text, FlatList, ActivityIndicator, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { useRides } from '@/hooks/useRides';
import RideCard from '@/components/RideCard';
import { useRouter } from 'expo-router';
import { Ride } from '@/types/type';
import { useAuth } from '@/context/AuthProvider';

export default function Rides() {
  const router = useRouter();
  const { fetchAvailableRides, publishedRideByMe } = useRides();
  const { user } = useAuth();
  const [rides, setRides] = useState<Ride[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [availableRides, setAvailableRides] = useState<Ride[]>([]);

  useEffect(() => {
    loadRides();
  }, []);

  const loadRides = async () => {
    try {
      setIsLoading(true);
      const PublishedRideByMe = await publishedRideByMe(user?.id as string);
      setRides(PublishedRideByMe);

      const availableRides = await fetchAvailableRides();
      setAvailableRides(availableRides);

      setIsLoading(false);
    } catch (error) {
      console.error('Error loading rides:', error);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-[#dcdcdc]">
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" className='color-primary' />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#dcdcdc]">
      <ScrollView >
      <View className="p-4">
        <Text className="text-2xl font-plusjakartasans_600semibold mb-4">
          My Rides
        </Text>

        <FlatList
          data={rides}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <RideCard
              ride={item}
              onPress={() => { }}
            // onPress={() => router.push(`/ride/${item.id}`)}
            />
          )}
          ItemSeparatorComponent={() => <View className="h-4" />}
          showsVerticalScrollIndicator={false}
        />

        <Text className="text-2xl font-plusjakartasans_600semibold mb-4 mt-3">
          Available Rides
        </Text>

        <FlatList
          data={availableRides}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <RideCard
              ride={item}
              onPress={() => { }}
            // onPress={() => router.push(`/ride/${item.id}`)}
            />
          )}
          ItemSeparatorComponent={() => <View className="h-4" />}
          showsVerticalScrollIndicator={false}
        />
      </View>
      </ScrollView>
    </SafeAreaView>
  );
}