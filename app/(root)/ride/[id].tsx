import { View, Text, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import Button from '@/components/Button';
import Maps from '@/components/Maps';
import { MatchedRide, Ride } from '@/types/type';
import { Feather } from '@expo/vector-icons';
import { useRides } from '@/hooks/useRides';

export default function RideDetails() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const params = useLocalSearchParams();
  const [ride, setRide] = useState<Ride | MatchedRide | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [walkingPoints, setWalkingPoints] = useState([]);
  const [riderInfo, setRiderInfo] = useState<{ name: string; photo_url: string } | null>(null);
  const { requestRide } = useRides();

  useEffect(() => {
    const walkingPointsData = JSON.parse(params.walkingPoints as string);
    setWalkingPoints(walkingPointsData);
    console.log('Walking Points: ', walkingPointsData);
    loadRideDetails();
  }, [id]);

  const loadRideDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('rides')
        .select('*, users!ride_rider_id_fkey(id, name, photo_url)')
        .eq('id', id)
        .single();

      if (error) throw error;
      setRide(JSON.parse(params.ride as string));
      setRiderInfo(data.users);
      console.log('Ride Details: ', data);
      console.log("Params: ", JSON.parse(params.ride as string));
    } catch (error) {
      console.error('Error loading ride details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center">
        <Text className="font-plusjakartasans_500medium">Loading ride details...</Text>
      </SafeAreaView>
    );
  }

  if (!ride) return null;

  const requestRides = async () => {
    try {
      const requestedRide = await requestRide(ride);
      console.log("Published Ride: ", requestedRide);
      router.push({
        pathname: "/(root)/published-ride",
        params: { ride: JSON.stringify(requestedRide) }
      });

    } catch (error) {
      console.error('Error:', error);
      alert('Failed to publish ride. Please try again.');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView>
        <View className="h-96">
          <Maps
            sourceLocation={ride.source_location}
            destinationLocation={ride.destination_location}
            walkingPoints={walkingPoints}
          />
        </View>

        <View className="p-4">
          {riderInfo && (
            <View className="flex-row items-center mb-6">
              <Image
                source={{ uri: riderInfo.photo_url }}
                className="w-12 h-12 rounded-full mr-4"
              />
              <View>
                <Text className="text-lg font-plusjakartasans_600semibold">{riderInfo.name}</Text>
                <Text className="text-sm font-plusjakartasans_500medium text-gray">Rider</Text>

              </View>
            </View>
          )}
          <View className="flex-row justify-between items-center mb-6">
            <View>
              <Text className="text-xl font-plusjakartasans_600semibold">
                {ride.source_location.address}
              </Text>
              <Text className="text-gray font-plusjakartasans">To</Text>
              <Text className="text-xl font-plusjakartasans_600semibold">
                {ride.destination_location.address}
              </Text>
            </View>

          </View>
          <View className="flex-row items-center mb-2">
            <Feather name="users" size={20} color="gray" />
            <Text className="ml-2 font-plusjakartasans">
              {ride.no_of_seats_available} {ride.no_of_seats_available == 1 ? 'seat' : 'seats'}
            </Text>
          </View>

          <View className="flex-row items-center mb-2">
            <Feather name="calendar" size={20} color="gray" />
            <Text className="ml-2 font-plusjakartasans">
              {ride.departure_time}
            </Text>
          </View>

          <View className="flex-row items-center mb-2">
            <Feather name="truck" size={20} color="gray" />
            <Text className="ml-2 font-plusjakartasans">
              {ride.vehicle_type} - {ride.number_plate}
            </Text>
          </View>

          {'sourceWalkingTime' in ride && (ride.sourceWalkingTime > 0 || ride.destinationWalkingTime > 0) && (
            <View className="mt-2 mb-3 pt-2 border-t border-gray-100">
              <Text className="text-xs text-gray font-plusjakartasans">
                {ride.sourceWalkingTime > 0 && `${Math.round(ride.sourceWalkingTime / 60)} min walk to pickup`}
                {ride.sourceWalkingTime > 0 && ride.destinationWalkingTime > 0 && ' • '}
                {ride.destinationWalkingTime > 0 && `${Math.round(ride.destinationWalkingTime / 60)} min walk from drop-off`}
              </Text>
            </View>
          )}

          <Button
            title="Request Ride"
            onPress={requestRides}
          />
        </View>
        {/* <RideCard ride={ride} showMap={true} onPress={() => {}} /> */}
      </ScrollView>
    </SafeAreaView>
  );
}