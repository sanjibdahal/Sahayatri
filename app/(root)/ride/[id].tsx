import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import Button from '@/components/Button';
import Maps from '@/components/Maps';
import { Ride } from '@/types/type';
import { Feather } from '@expo/vector-icons';

export default function RideDetails() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [ride, setRide] = useState<Ride | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadRideDetails();
  }, [id]);

  const loadRideDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('rides')
        .select('*, users!ride_rider_id_fkey(name)')
        .eq('id', id)
        .single();

      if (error) throw error;
      setRide(data);
      console.log('Ride Details: ', data);
    } catch (error) {
      console.error('Error loading ride details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!ride) return null;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView>
        <View className="h-48">
          <Maps
            sourceLocation={ride.source_location}
            destinationLocation={ride.destination_location}
          />
        </View>

        <View className="p-4">
          <View className="flex-row justify-between items-center mb-6">
            <View>
              <Text className="text-2xl font-plusjakartasans_600semibold">
                {ride.source_location.address}
              </Text>
              <Text className="text-gray font-plusjakartasans">To</Text>
              <Text className="text-2xl font-plusjakartasans_600semibold">
                {ride.destination_location.address}
              </Text>
            </View>
            <View className="items-end">
              <Text className="text-lg font-plusjakartasans_600semibold text-primary">
                {ride.no_of_seats_available} seats
              </Text>
              <Text className="text-gray font-plusjakartasans">available</Text>
            </View>
          </View>

          <View className="flex-row items-center mb-4">
            <Feather name="calendar" size={20} color="gray" />
            <Text className="ml-2 font-plusjakartasans">
              {new Date(ride.departure_time).toLocaleDateString()}
            </Text>
          </View>

          <View className="flex-row items-center mb-4">
            <Feather name="clock" size={20} color="gray" />
            <Text className="ml-2 font-plusjakartasans">
              {new Date(ride.departure_time).toLocaleTimeString()}
            </Text>
          </View>

          <View className="flex-row items-center mb-6">
            <Feather name="truck" size={20} color="gray" />
            <Text className="ml-2 font-plusjakartasans">
              {ride.vehicle_type} - {ride.number_plate}
            </Text>
          </View>

          <Button
            title="Request Ride"
            onPress={() => router.push(`/request-ride?rideId=${ride.id}`)}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}