import { View, Text, FlatList, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useRides } from '@/hooks/useRides';
import RideCard from '@/components/RideCard';
import { MatchedRide } from '@/types/type';
import { Feather } from '@expo/vector-icons';
import Maps from '@/components/Maps';

export default function SearchResults() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { searchRides } = useRides();
  const [exactMatches, setExactMatches] = useState<MatchedRide[]>([]);
  const [nearbyMatches, setNearbyMatches] = useState<MatchedRide[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRide, setSelectedRide] = useState<MatchedRide | null>(null);

  useEffect(() => {
    loadRides();
  }, []);

  const loadRides = async () => {
    try {
      const source_location = JSON.parse(params.source as string);
      const destination_location = JSON.parse(params.destination as string);
      const no_of_seats_available = Number(params.seats);
      const departure_time = params.departureTime as string;

      const results = await searchRides({
        source_location,
        destination_location,
        no_of_seats_available,
        departure_time
      });

      setExactMatches(results.exactMatches);
      setNearbyMatches(results.nearbyMatches);
    } catch (error) {
      console.error('Error loading rides:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getWalkingPoints = (ride: MatchedRide) => {
    const points = [];
    
    // Add source walking point if not exact match
    // if (!ride.isExactMatch && ride.sourceDistance > 0) {
    //   points.push({
    //     start: {
    //       latitude: JSON.parse(params.source as string).latitude,
    //       longitude: JSON.parse(params.source as string).longitude,
    //     },
    //     end: {
    //       latitude: ride.source_location.latitude,
    //       longitude: ride.source_location.longitude,
    //     },
    //   });
    // }

    // Add destination walking point if not exact match
    if (!ride.isExactMatch && ride.destinationDistance > 0) {
      points.push({
        start: {
          latitude: ride.destination_location.latitude,
          longitude: ride.destination_location.longitude,
        },
        end: {
          latitude: JSON.parse(params.destination as string).latitude,
          longitude: JSON.parse(params.destination as string).longitude,
        },
      });
    }

    return points;
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center">
        <Text className="font-plusjakartasans">Searching for rides...</Text>
      </SafeAreaView>
    );
  }

  if (exactMatches.length === 0 && nearbyMatches.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-white p-4">
        <View className="items-center mb-8">
          <Feather name="alert-circle" size={48} color="#6B7280" />
          <Text className="text-xl font-plusjakartasans_600semibold mt-4">
            No rides found
          </Text>
          <Text className="text-gray text-center font-plusjakartasans mt-2">
            No rides are currently published for your route. Try adjusting your search criteria or check back later.
          </Text>
        </View>

        <Text className="text-xl font-plusjakartasans_600semibold mb-4">
          Recommended Rides
        </Text>
        {/* Add recommended rides logic here */}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="p-4">
      {selectedRide && (
          <View className="h-64 mb-4 rounded-xl overflow-hidden">
            <Maps
              sourceLocation={JSON.parse(params.source as string)}
              destinationLocation={JSON.parse(params.destination as string)}
              walkingPoints={getWalkingPoints(selectedRide)}
            />
          </View>
        )}
        {exactMatches.length > 0 && (
          <View className="mb-6">
            <Text className="text-xl font-plusjakartasans_600semibold mb-4">
              Perfect Matches
            </Text>
            {exactMatches.map(ride => (
              <RideCard
                key={ride.id}
                ride={ride}
                onPress={() => {
                  setSelectedRide(ride);
                  router.push(`/ride/${ride.id}`);
                }}
                containerStyles="mb-4"
              />
            ))}
          </View>
        )}

        {nearbyMatches.length > 0 && (
          <View>
            <Text className="text-xl font-plusjakartasans_600semibold mb-4">
              Nearby Rides
            </Text>
            {nearbyMatches.map(ride => (
              <View key={ride.id} className="mb-4">
                <RideCard
                  ride={ride}
                  onPress={() => {
                    setSelectedRide(ride);
                    router.push(`/ride/${ride.id}`);
                  }}
                />
                {/* <Text className="text-gray font-plusjakartasans mt-2">
                  {ride.sourceWalkingTime > 0 && `${Math.round(ride.sourceWalkingTime / 60)} min walk to pickup • `}
                  {ride.destinationWalkingTime > 0 && `${Math.round(ride.destinationWalkingTime / 60)} min walk from drop-off`}
                </Text> */}
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}