import { View, Text, FlatList, ActivityIndicator, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { useRides } from '@/hooks/useRides';
import RideCard from '@/components/RideCard';
import { useRouter } from 'expo-router';
import { Ride, RideRequest } from '@/types/type';
import { useAuth } from '@/context/AuthProvider';
import RideRequestCard from '@/components/RideRequestCard';

export default function Rides() {
  const router = useRouter();
  const { fetchAvailableRides, publishedRideByMe, requestedRide } = useRides();
  const { user } = useAuth();
  const [rides, setRides] = useState<Ride[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [availableRides, setAvailableRides] = useState<Ride[]>([]);
  const [requestedRides, setRequestedRides] = useState<RideRequest[]>([]);

  useEffect(() => {
    loadRides();
  }, []);

  const loadRides = async () => {
    try {
      setIsLoading(true);
      const PublishedRideByMe = await publishedRideByMe(user?.id as string);
      setRides(PublishedRideByMe);

      const availableRides = await fetchAvailableRides(user?.id as string);
      setAvailableRides(availableRides);

      const RequestedRides = await requestedRide();
      setRequestedRides(RequestedRides);

      setIsLoading(false);
    } catch (error) {
      console.error('Error loading rides:', error);
    }
  };

  

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-[#e1e1e1]">
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" className='color-primary' />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#e1e1e1]">
      <ScrollView >
        <View className="p-4">
          <Text className="text-2xl font-plusjakartasans_600semibold mb-4 mt-3">
            Requested Rides
          </Text>

          {requestedRides.length > 0 ? (
            <FlatList
              data={requestedRides}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <RideRequestCard
                  ride={item}
                  showImage={true}
                  onPress={() => { router.push(`/riderequest/${item.ride_id}`) }}
                />
              )}
              ItemSeparatorComponent={() => <View className="h-4" />}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <Text className="text-gray-500 font-plusjakartasans_500medium text-center py-4">
              No requested rides.
            </Text>
          )}
          <Text className="text-2xl font-plusjakartasans_600semibold mb-4">
            My Published Rides
          </Text>

          {rides.length > 0 ? (
            <FlatList
              data={rides}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <RideCard
                  ride={item}
                  showImage={true}
                  onPress={() => { const walkingPoints = null;
                    router.push({
                      pathname: `/ride/${item.id}`,
                      params: {
                        ride: JSON.stringify(item),
                        walkingPoints: JSON.stringify(walkingPoints)
                      }
                    }); }}
                />
              )}
              ItemSeparatorComponent={() => <View className="h-4" />}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <Text className="text-gray-500 font-plusjakartasans_500medium text-center py-4">
              You haven't published any rides yet.
            </Text>
          )}

          <Text className="text-2xl font-plusjakartasans_600semibold mb-4 mt-3">
            Available Rides
          </Text>

          {availableRides.length > 0 ? (
            <FlatList
              data={availableRides}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <RideCard
                  ride={item}
                  showImage={true}
                  onPress={() => { const walkingPoints = null;
                    router.push({
                      pathname: `/ride/${item.id}`,
                      params: {
                        ride: JSON.stringify(item),
                        walkingPoints: JSON.stringify(walkingPoints)
                      }
                    }); }}
                />
              )}
              ItemSeparatorComponent={() => <View className="h-4" />}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <Text className="text-gray-500 font-plusjakartasans_500medium text-center py-4">
              No rides available at the moment.
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView >
  );
}