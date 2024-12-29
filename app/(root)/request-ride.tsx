import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
// import { supabase } from '@/lib/supabase';
import InputField from '@/components/InputField';
import Button from '@/components/Button';
import LocationPicker from '@/components/LocationPicker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Location } from '@/types/type';

export default function RequestRide() {
  const router = useRouter();
  const { rideId } = useLocalSearchParams();

  const [showDatePicker, setShowDatePicker] = useState(false); 
  const [form, setForm] = useState({
    seats: '1',
    source: null as Location | null,
    destination: null as Location | null,
    departureTime: new Date(),
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleRequest = async () => {
    // try {
    //   if (!form.source || !form.destination) {
    //     setError('Please select pickup and drop-off locations');
    //     return;
    //   }

    //   setIsSubmitting(true);
    //   setError('');
      
    //   const { error: requestError } = await supabase
    //     .from('ride_requests')
    //     .insert({
    //       ride_id: rideId,
    //       seats_needed: parseInt(form.seats),
    //       source: form.source,
    //       destination: form.destination,
    //       departure_time: form.departureTime.toISOString(),
    //       status: 'pending'
    //     });

    //   if (requestError) throw requestError;
    //   router.back();
    // } catch (err: any) {
    //   setError(err.message);
    // } finally {
    //   setIsSubmitting(false);
    // }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="p-4">
        <Text className="text-2xl font-plusjakartasans_600semibold mb-6">
          Request Ride
        </Text>

        <InputField
          title="Number of Seats"
          placeholder="How many seats do you need?"
          value={form.seats}
          onChangeText={(value) => setForm({ ...form, seats: value })}
          keyboardType="numeric"
        />

        <LocationPicker
          title="Pickup Location"
          onLocationSelect={(location) => setForm({ ...form, source: location })}
        />

        <LocationPicker
          title="Drop-off Location"
          onLocationSelect={(location) => setForm({ ...form, destination: location })}
        />

        <View className="mt-4">
          <Text className="text-lg font-plusjakartasans mb-2">Departure Time</Text>
          <Button
            title={form.departureTime.toLocaleString()}
            onPress={() => setShowDatePicker(true)}
          />
          {showDatePicker && (
            <DateTimePicker
              value={form.departureTime}
              mode="datetime"
              display='default'
              onChange={(event, date) => {
                setShowDatePicker(false);
                date && setForm({ ...form, departureTime: date });
              }}
            />
          )}
          
        </View>

        {error && (
          <Text className="text-red-500 mt-2 font-plusjakartasans">
            {error}
          </Text>
        )}

        <Button
          title="Request Ride"
          onPress={handleRequest}
          isLoading={isSubmitting}
          containerStyles="mt-6"
        />
      </ScrollView>
    </SafeAreaView>
  );
}