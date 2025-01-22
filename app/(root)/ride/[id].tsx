import { View, Text, ScrollView, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import Button from '@/components/Button';
import Maps from '@/components/Maps';
import { MatchedRide, Ride } from '@/types/type';
import { Feather } from '@expo/vector-icons';
import { useRides } from '@/hooks/useRides';
import { useAuth } from '@/context/AuthProvider';

export default function RideDetails() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { user } = useAuth();
  const params = useLocalSearchParams();
  const [ride, setRide] = useState<Ride | MatchedRide | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [walkingPoints, setWalkingPoints] = useState([]);
  const [riderInfo, setRiderInfo] = useState<{ id: string; name: string; photo_url: string } | null>(null);
  const { requestRide, cancelRide } = useRides();
  const [requester, setRequester] = useState<{ id: string; name: string; photo_url: string } | null>(null);

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
      if (data.status === 'booked' && user?.id === data.rider_id) {
        const { data: requestData, error: requestError } = await supabase
          .from('ride_request')
          .select('*, users!ride_request_user_id_fkey(id, name, photo_url)')
          .eq('ride_id', params.id)
          .eq('status', 'accepted')
          .single();

        if (requestError) throw requestError;
        setRequester(requestData.users);
      }
    } catch (error) {
      console.error('Error loading ride details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const chatWithRider = async () => {
    try {
      if (!user || !requester) return;
  
      const { data: existingChat, error: chatError } = await supabase
        .from('chats')
        .select('id')
        .or(`user_1_id.eq.${user.id},user_2_id.eq.${user.id}`)
        .or(`user_1_id.eq.${requester.id},user_2_id.eq.${requester.id}`)
        .single();
  
      if (chatError && chatError.code !== 'PGRST116') {
        throw chatError;
      }
  
      let chatId;
  
      if (existingChat) {
        chatId = existingChat.id;
      } else {
        // Create new chat
        const { data: newChat, error: createError } = await supabase
          .from('chats')
          .insert({
            user_1_id: user.id,
            user_2_id: requester.id
          })
          .select('id')
          .single();
  
        if (createError) throw createError;
        chatId = newChat.id;
      }
  
      router.push({
          pathname: "/chats/[chatID]",
          params: {
            chatID: chatId,
            name: requester.name,
            photo_url: requester.photo_url
          }
        });
    } catch (error) {
      console.error('Error setting up chat:', error);
      alert('Failed to start chat. Please try again.');
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

  const handleCancel = async () => {
    Alert.alert("Cancel Ride", "Are you sure you want to cancel this ride?",
      [{
        text: "No",
        onPress: () => console.log("Cancel Pressed"),
      },
      {
        text: "Yes, Cancel",
        onPress: async () => {
          try {
            setIsLoading(true);
            await cancelRide(params.id as string);
            router.replace('/(root)/(tabs)/rides');
          } catch (error) {
            console.error('Error:', error);
            alert('Failed to cancel ride. Please try again.');
          }
        }
      }

      ]);
  };

  const isRider = user?.id === ride.rider_id;

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
                <Text className="text-sm font-plusjakartasans_500medium text-gray">Rider {isRider ? '(You)' : ''}</Text>

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

          {ride.status === 'booked' ? (
            <View>
            {user?.id === ride.rider_id && requester && (
              <View className="mb-6 bg-gray-50 rounded-xl flex">
                <Text className="text-lg font-plusjakartasans_600semibold mb-2">
                  Ride Requester
                </Text>
                <View className="">
                  <View className="flex-row items-center mb-2">
                    <Image 
                      source={{ uri: requester.photo_url }} 
                      className="w-12 h-12 rounded-full mr-3"
                    />
                    <Text className="text-lg font-plusjakartasans_500medium">
                      {requester.name}
                    </Text>
                  </View>
                  <Button
                    title="Chat"
                    onPress={chatWithRider}
                    containerStyles="px-6"
                  />
                </View>
              </View>
            )}
          </View>
          ) : (isRider ? (
            <View className='flex-row gap-x-2 flex-1'>
              <Button
                title="Edit Ride"
                onPress={() => router.push({ pathname: '/edit-ride', params: { id: ride.id } })}
                isSecondary={true}
                containerStyles='flex-1'
              />
              <Button
                title="Cancel Ride"
                onPress={ handleCancel }
                containerStyles='flex-1 bg-red'
              />
            </View>
          ) : (
            <Button
              title="Request Ride"
              onPress={requestRides}
            />
          ))}
        </View>
        {/* <RideCard ride={ride} showMap={true} onPress={() => {}} /> */}
      </ScrollView>
    </SafeAreaView>
  );
}