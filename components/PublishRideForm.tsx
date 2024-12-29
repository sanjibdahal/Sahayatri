import { View, Text, ScrollView, Platform } from 'react-native';
import { useState } from 'react';
import { useLocation } from '@/hooks/useLocation';
import Button from './Button';
import InputField from './InputField';
import LocationSearch from './LocationSearch';
import VehicleTypeSelect from './VehicleTypeSelect';
import SeatCounter from './SeatCounter';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Location } from '@/types/type';

type Props = {
  onSubmit: (formData: any) => void;
  isSubmitting: boolean;
};

export default function PublishRideForm({ onSubmit, isSubmitting }: Props) {
  const { location } = useLocation();

  const [showDatePicker, setShowDatePicker] = useState(false);
  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setForm({ ...form, departureTime: selectedDate });
    }
  };

  const [form, setForm] = useState({
    vehicleType: 'car',
    vehiclePlate: '',
    seatsAvailable: 1,
    sourceLocation: location ? {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      address: 'Current Location'
    } as Location : null,
    destinationLocation: null as Location | null,
    departureTime: new Date(),
  });

  const handleSubmit = () => {
    onSubmit(form);
  };

  return (
    <ScrollView className="p-4">
      <Text className="text-2xl font-plusjakartasans_600semibold mb-6">
        Publish a Ride
      </Text>

      <VehicleTypeSelect
        value={form.vehicleType}
        onChange={(value) => setForm({ ...form, vehicleType: value })}
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
      />

      <InputField 
        title="Source Location" 
        icon={"crosshair"}
        value={form.sourceLocation?.address} 
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
          value={form.departureTime}
          mode="date"
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
    </ScrollView>
  );
}