import { View, ScrollView, Text, Platform, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import { useRides } from '@/hooks/useRides';
import VehicleTypeSelect from '@/components/VehicleTypeSelect';
import InputField from '@/components/InputField';
import SeatCounter from '@/components/SeatCounter';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Location } from '@/types/type';
import { useLocation } from '@/hooks/useLocation';
import LocationSearch from '@/components/LocationSearch';
import Button from '@/components/Button';
import { format, parse } from 'date-fns';
import { icons } from '@/constants';
import { useAuth } from '@/context/AuthProvider';
import { router } from 'expo-router';
import Maps from '@/components/Maps';

export default function PublishRide() {
  const { publishRide } = useRides();
  const { user } = useAuth();
  const { location, locationName } = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);


  // console.log("Location Detail: ", location, locationName);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      const formattedDate = format(selectedDate, 'yyyy-MM-dd hh:mm a');
      console.log("Selected Date: ", formattedDate);
      setForm({ ...form, departure_time: formattedDate });
    }
  };

  const [form, setForm] = useState({
    riderId: user?.id,
    vehicleType: 'car',
    number_plate: '',
    no_of_seats_available: 1,
    sourceLocation: null as Location | null,
    destinationLocation: null as Location | null,
    departure_time: format(new Date(), 'yyyy-MM-dd hh:mm a'),
  });

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

  const handleSubmit = async () => {
    const errors = [];

    if (!form.number_plate.trim()) {
      errors.push('Vehicle plate number is required');
    }

    if (!form.sourceLocation) {
      errors.push('Source location is required');
    }

    if (!form.destinationLocation) {
      errors.push('Destination location is required');
    }

    if (form.no_of_seats_available < 1) {
      errors.push('Seats available must be at least 1');
    }

    const departure_time = parse(form.departure_time, 'yyyy-MM-dd hh:mma', new Date());
    const now = new Date();
    if (departure_time < now) {
      errors.push('Departure time must be in the future');
    }

    if (errors.length > 0) {
      alert('Please fill in all required information:\n\n' + errors.join('\n'));
      return;
    }

    try {
      setIsSubmitting(true);
      console.log("Form Detail: ", form);
      const publishedRide = await publishRide(form);
      console.log("Published Ride: ", publishedRide);
      router.push({
        pathname: "/(root)/published-ride",
        params: { ride: JSON.stringify(publishedRide) }
      });

    } catch (error) {
      console.error('Error:', error);
      alert('Failed to publish ride. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderContent = () => (
    <View className="p-4">
      <Text className="text-2xl font-plusjakartasans_700bold mb-6">
        Publish a Ride
      </Text>

      <VehicleTypeSelect
        value={form.vehicleType}
        onChange={(value) => setForm({ ...form, vehicleType: value, no_of_seats_available: 1 })}
      />

      <InputField
        title="Vehicle Plate"
        placeholder="Enter vehicle plate number"
        value={form.number_plate}
        onChangeText={(value) => setForm({ ...form, number_plate: value })}
      />

      <SeatCounter
        value={form.no_of_seats_available}
        onChange={(value) => setForm({ ...form, no_of_seats_available: value })}
        vehicleType={form.vehicleType}
        title='Available Seats'
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
        <Text className="text-lg font-plusjakartasans mb-2">Departure Time</Text>
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

      <Button
        title="Publish Ride"
        onPress={handleSubmit}
        isLoading={isSubmitting}
      />
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <FlatList
        data={[1]}
        renderItem={() => renderContent()}
        keyExtractor={(item, index) => index.toString()}
      />
    </SafeAreaView>
  );
}