import { View, ScrollView, Text, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import { useRides } from '@/hooks/useRides';
import { useRouter, useLocalSearchParams } from 'expo-router';
import VehicleTypeSelect from '@/components/VehicleTypeSelect';
import InputField from '@/components/InputField';
import SeatCounter from '@/components/SeatCounter';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Location } from '@/types/type';
import LocationSearch from '@/components/LocationSearch';
import Button from '@/components/Button';
import { format, parse } from 'date-fns';
import { supabase } from '@/lib/supabase';
import Maps from '@/components/Maps';
import { useLocation } from '@/hooks/useLocation';

export default function EditRide() {
    const { updateRide, cancelRide } = useRides();
    const router = useRouter();
    const params = useLocalSearchParams();
    const [isLoading, setIsLoading] = useState(true);
    const { location, locationName } = useLocation();
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [form, setForm] = useState({
        vehicleType: '',
        number_plate: '',
        no_of_seats_available: 1,
        sourceLocation: null as Location | null,
        destinationLocation: null as Location | null,
        departure_time: format(new Date(), 'yyyy-MM-dd hh:mm a'),
    });

    useEffect(() => {
        const loadRideDetails = async () => {
            try {
                const { data, error } = await supabase
                    .from('rides')
                    .select('*')
                    .eq('id', params.id)
                    .single();

                if (error) throw error;

                setForm({
                    vehicleType: data.vehicle_type,
                    number_plate: data.number_plate,
                    no_of_seats_available: data.no_of_seats_available,
                    sourceLocation: data.source_location,
                    destinationLocation: data.destination_location,
                    departure_time: data.departure_time,
                });
            } catch (error) {
                console.error('Error loading ride details:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadRideDetails();
    }, [params.id]);

    const handleDateChange = (event: any, selectedDate?: Date) => {
        setShowDatePicker(Platform.OS === 'ios');
        if (selectedDate) {
            const formattedDate = format(selectedDate, 'yyyy-MM-dd hh:mm a');
            setForm({ ...form, departure_time: formattedDate });
        }
    };

    const handleUpdate = async () => {
        try {
            setIsLoading(true);
            await updateRide(params.id as string, form);
            router.back();
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to update ride. Please try again.');
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

    if (isLoading) {
        return (
            <SafeAreaView className="flex-1 bg-white justify-center items-center">
                <Text>Loading...</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-white">
            <ScrollView className="p-4">
                <Text className="text-2xl font-plusjakartasans_700bold mb-6">
                    Edit Ride
                </Text>

                <VehicleTypeSelect
                    value={form.vehicleType}
                    onChange={(value) => setForm({ ...form, vehicleType: value })}
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

                <LocationSearch
                    placeholder="Search destination"
                    value={form.destinationLocation?.address || ''}
                    onLocationSelect={(location) => setForm({ ...form, destinationLocation: location })}
                />

                <View className="mt-4 mb-6">
                    <Text className="text-lg font-plusjakartasans mb-2">Departure Time</Text>
                    <Button
                        title={form.departure_time}
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

                <View className="flex-row gap-x-2 mb-10">
                    <Button
                        title="Update Ride"
                        onPress={handleUpdate}
                        containerStyles="flex-1"
                    />
                    <Button
                        title="Cancel Ride"
                        onPress={handleCancel}
                        containerStyles="flex-1 bg-red"
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}