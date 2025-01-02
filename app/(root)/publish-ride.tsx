import { View, ScrollView, Text, Platform, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { useRides } from '@/hooks/useRides';
import VehicleTypeSelect from '@/components/VehicleTypeSelect';
import InputField from '@/components/InputField';
import SeatCounter from '@/components/SeatCounter';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Location } from '@/types/type';
import { useLocation } from '@/hooks/useLocation';
import LocationSearch from '@/components/LocationSearch';
import Button from '@/components/Button';
import {format, parse} from 'date-fns';

export default function PublishRide() {
  const router = useRouter();
  const { publishRide } = useRides();
  const { location, locationName } = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);


  // console.log("Location Detail: ", location, locationName);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      const formattedDate = format(selectedDate, 'yyyy-MM-dd hh:mm a');
      console.log("Selected Date: ", formattedDate);
      setForm({ ...form, departureTime: formattedDate });
    }
  };

  const [form, setForm] = useState({
    vehicleType: 'car',
    vehiclePlate: '',
    seatsAvailable: 1,
    sourceLocation: null as Location | null,
    destinationLocation: null as Location | null,
    departureTime: format(new Date(), 'yyyy-MM-dd hh:mm a'),
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

    if (!form.vehiclePlate.trim()) {
      errors.push('Vehicle plate number is required');
    }

    if (!form.sourceLocation) {
      errors.push('Source location is required');
    }

    if (!form.destinationLocation) {
      errors.push('Destination location is required');
    }

    if (form.seatsAvailable < 1) {
      errors.push('Seats available must be at least 1');
    }

    const departureTime = parse(form.departureTime, 'yyyy-MM-dd hh:mm a', new Date());
    const now = new Date();
    if (departureTime < now) {
      errors.push('Departure time must be in the future');
    }

    if (errors.length > 0) {
      alert('Please fill in all required information:\n\n' + errors.join('\n'));
      return;
    }

    try {
      setIsSubmitting(true);
      console.log("Form Detail: ", form);
      await publishRide(form);
      router.back();
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
        onChange={(value) => setForm({ ...form, vehicleType: value, seatsAvailable: 1 })}
      />

      <InputField
        title="Vehicle Plate"
        placeholder="Enter vehicle plate number"
        value={form.vehiclePlate}
        onChangeText={(value) => setForm({ ...form, vehiclePlate: value })}
      />

      <SeatCounter
        value={form.seatsAvailable}
        onChange={(value) => setForm({ ...form, seatsAvailable: value })}
        vehicleType={form.vehicleType}
      />

      <InputField
        title="Source Location"
        icon="crosshair"
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
          title={form.departureTime.toLocaleString()}
          isSecondary={true}
          onPress={() => setShowDatePicker(true)}
        />
        {(showDatePicker || Platform.OS === 'ios') && (
          <DateTimePicker
            testID="dateTimePicker"
            value={parse(form.departureTime, 'yyyy-MM-dd hh:mm a', new Date())}
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
        contentContainerStyle={{ padding: 16 }}
      />
    </SafeAreaView>
  );
}