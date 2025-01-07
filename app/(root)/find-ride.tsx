import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { router, useRouter } from 'expo-router';
import { useRides } from '@/hooks/useRides';
import { Location } from '@/types/type';
import LocationSearch from '@/components/LocationSearch';
import SeatCounter from '@/components/SeatCounter';
import Button from '@/components/Button';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';

export default function FindRide() {
  const [form, setForm] = useState({
    source: null as Location | null,
    destination: null as Location | null,
    seats: 1,
    departureTime: format(new Date(), 'yyyy-MM-dd hh:mm a'),
  });

  const handleSearch = () => {
    router.push({
      pathname: '/(root)/search-results',
      params: {
        source: JSON.stringify(form.source),
        destination: JSON.stringify(form.destination),
        seats: form.seats,
        departureTime: form.departureTime,
      },
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="p-4">
        <LocationSearch
          placeholder="Enter pickup location"
          onLocationSelect={(location) => setForm({ ...form, source: location })}
          value='Source Location'
        />

        <LocationSearch
          placeholder="Enter destination"
          onLocationSelect={(location) => setForm({ ...form, destination: location })}
          value='Destination Location'
        />

        <SeatCounter
          value={form.seats}
          onChange={(value) => setForm({ ...form, seats: value })}
          vehicleType='car'
          title='Seats'
        />

        {/* <View className="mt-4">
          <DateTimePicker
            value={form.departureTime.}
            mode="datetime"
            onChange={(event, date) => date && setForm({ ...form, departureTime: date })}
          />
        </View> */}

        <Button
          title="Search Rides"
          onPress={handleSearch}
          containerStyles="mt-6"
        />
      </ScrollView>
    </SafeAreaView>
  );
}