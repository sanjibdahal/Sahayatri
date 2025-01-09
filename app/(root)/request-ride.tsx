import { View, Text, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { supabase } from '@/lib/supabase';
import InputField from '@/components/InputField';
import Button from '@/components/Button';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Location } from '@/types/type';
import { useAuth } from '@/context/AuthProvider';
import { format, parse } from 'date-fns';
import { useLocation } from '@/hooks/useLocation';
import SeatCounter from '@/components/SeatCounter';
import { icons } from '@/constants';
import LocationSearch from '@/components/LocationSearch';
import Maps from '@/components/Maps';

export default function RequestRide() {
  const { rideId } = useLocalSearchParams();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const { location, locationName } = useLocation();

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      const formattedDate = format(selectedDate, 'yyyy-MM-dd hh:mm a');
      // console.log("Selected Date: ", formattedDate);
      setForm({ ...form, departure_time: formattedDate });
    }
  };
  const [form, setForm] = useState({
    no_of_seats_available: 1,
    sourceLocation: null as Location | null,
    destinationLocation: null as Location | null,
    departure_time: format(new Date(), 'yyyy-MM-dd hh:mm a'),
  });

  const handleSearch = () => {
    console.log("Form Data: ", form);
    router.push({
      pathname: '/(root)/search-results',
      params: {
        source: JSON.stringify(form.sourceLocation),
        destination: JSON.stringify(form.destinationLocation),
        seats: form.no_of_seats_available,
        departureTime: form.departure_time,
      },
    });
  };

  useEffect(() => {
    if (location) {
      setForm(prev => ({
        ...prev,
        sourceLocation: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          address: locationName || 'Current Location'
        }
      }));
    }
  }, [location, locationName]);



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
          Find a Ride
        </Text>

        <SeatCounter
          value={form.no_of_seats_available}
          onChange={(value) => setForm({ ...form, no_of_seats_available: value })}
          vehicleType={'car'}
          title='Number of Seats'
        />

        <Maps sourceLocation={location ? {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude
        } : { latitude: 0, longitude: 0 }} destinationLocation={form.destinationLocation} />


        <InputField
          title="Source Location"
          imageIcon={icons.target}
          value={form.sourceLocation?.address || 'Current Location'}
          editable={false}
        />

        <LocationSearch
          placeholder="Search destination"
          value={form.destinationLocation?.address || ''}
          onLocationSelect={(location) => setForm({ ...form, destinationLocation: location })}
        />

        <View className="mt-4 mb-6">
          <Text className="text-lg color-graysecondary font-plusjakartasans_600semibold mb-2">Departure Time</Text>
          <Button
            title={form.departure_time.toLocaleString()}
            isSecondary={true}
            onPress={() => setShowDatePicker(true)}
          />
          {(showDatePicker || Platform.OS === 'ios') && (
            <DateTimePicker
              testID="dateTimePicker"
              value={parse(form.departure_time, 'yyyy-MM-dd hh:mm a', new Date())}
              mode="time"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleDateChange}
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
          onPress={handleSearch}
          isLoading={isSubmitting}
          containerStyles="mt-2 mb-10"
        />
      </ScrollView>
    </SafeAreaView>
  );
}