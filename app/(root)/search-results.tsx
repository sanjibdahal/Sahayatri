import { View, Text, FlatList, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useRides } from '@/hooks/useRides';
import RideCard from '@/components/RideCard';
import { MatchedRide } from '@/types/type';
import { Feather } from '@expo/vector-icons';
import Maps from '@/components/Maps';
import Button from '@/components/Button';
import { supabase } from '@/lib/supabase';

export default function SearchResults() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { searchRides, getRecommendedRides } = useRides();
  const [exactMatches, setExactMatches] = useState<MatchedRide[]>([]);
  const [nearbyMatches, setNearbyMatches] = useState<MatchedRide[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRide, setSelectedRide] = useState<MatchedRide | null>(null);
  const [isStoring, setIsStoring] = useState(false);
  const [recommendedRides, setRecommendedRides] = useState<MatchedRide[]>([]);

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

  // const storeRideRequest = async () => {
  //   try {
  //     setIsStoring(true);
  //     const source_location = JSON.parse(params.source as string);
  //     const destination_location = JSON.parse(params.destination as string);
  //     const no_of_seats_available = Number(params.seats);
  //     const departure_time = params.departureTime as string;

  //     const { error } = await supabase
  //       .from('ride_requests')
  //       .insert({
  //         source_location,
  //         destination_location,
  //         seats_needed: no_of_seats_available,
  //         departure_time,
  //         status: 'pending',
  //         notify_on_match: true
  //       });

  //     if (error) throw error;

  //     // Show success message and navigate back
  //     alert('We will notify you when matching rides are published!');
  //     router.back();
  //   } catch (error) {
  //     console.error('Error storing ride request:', error);
  //     alert('Failed to store ride request. Please try again.');
  //   } finally {
  //     setIsStoring(false);
  //   }
  // };

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
      <SafeAreaView className="flex-1 bg-[#e1e1e1] justify-center items-center">
        <Text className="font-plusjakartasans">Searching for rides...</Text>
      </SafeAreaView>
    );
  }

  if (exactMatches.length === 0 && nearbyMatches.length === 0) {
    return (
      <SafeAreaView className="flex-1 justify-center bg-[#e1e1e1] p-4">
        <View className="items-center justify-center mb-8">
          <Feather name="alert-circle" size={72} color="#FF0022" />
          <Text className="text-xl font-plusjakartasans_600semibold mt-4">
            No rides found
          </Text>
          <Text className="text-gray text-center font-plusjakartasans mt-2">
            No rides are currently published for your route. Try adjusting your search criteria or check back later.
          </Text>

          {/* <Button
            title="Notify me when rides are available"
            onPress={storeRideRequest}
            isLoading={isStoring}
            containerStyles="mt-6 w-full"
          /> */}
        </View>

      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#e1e1e1]">
      <ScrollView className="px-4">
        {/* {selectedRide && (
          <View className=" mb-4 rounded-xl overflow-hidden">
            <Maps
              sourceLocation={selectedRide.source_location}
              destinationLocation={selectedRide.destination_location}
              walkingPoints={getWalkingPoints(selectedRide)}
            />
          </View>
        )} */}
        {exactMatches.length > 0 && (
          <View className="mb-6">
            <Text className="text-xl font-plusjakartasans_600semibold mb-4">
              Perfect Matches
            </Text>
            {exactMatches.map(ride => (
              <RideCard
                key={ride.id}
                ride={ride}
                showMap={true}
                onPress={() => {
                  const walkingPoints = getWalkingPoints(ride);
                  router.push({
                    pathname: `/ride/${ride.id}`,
                    params: {
                      ride: JSON.stringify(ride),
                      walkingPoints: JSON.stringify(walkingPoints)
                    }
                  });
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
                  showMap={true}
                  onPress={() => {
                    const walkingPoints = getWalkingPoints(ride);
                    router.push({
                      pathname: `/ride/${ride.id}`,
                      params: {
                        ride: JSON.stringify(ride),
                        walkingPoints: JSON.stringify(walkingPoints)
                      }
                    });
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