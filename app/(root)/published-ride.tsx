import { View, Text } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ride } from '@/types/type';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '@/components/Button';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

export default function PublishedRide() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const ride = JSON.parse(params.ride as string) as Ride;
    // const ride = {
    //     vehicle_type: 'car',
    //     number_plate: 'KDA 123',
    //     no_of_seats_available: 3,
    //     source_location: {
    //         address: 'Jakarta',
    //     },
    //     destination_location: {
    //         address: 'Bogor',
    //     },
    //     departure_time: '2022-01-01 12:00 PM',
    // };



    return (
        <SafeAreaView className='flex-1 bg-white'>
            <View className="flex-1 p-4 justify-center">
                <View className=" items-center">
                    <FontAwesome5 name="check-circle" size={100} color="#57BE5E" />
                    <Text className="text-2xl font-plusjakartasans_700bold mb-6">Ride Published Successfully</Text>
                </View>
                <Text className="text-lg mb-2 font-plusjakartasans_500medium">Vehicle Type: {ride.vehicle_type}</Text>
                <Text className="text-lg mb-2 font-plusjakartasans_500medium">Vehicle Plate: {ride.number_plate}</Text>
                <Text className="text-lg mb-2 font-plusjakartasans_500medium">Seats Available: {ride.no_of_seats_available}</Text>
                <Text className="text-lg mb-2 font-plusjakartasans_500medium">Source Location: {ride.source_location.address}</Text>
                <Text className="text-lg mb-2 font-plusjakartasans_500medium">Destination Location: {ride.destination_location.address}</Text>
                <Text className="text-lg mb-2 font-plusjakartasans_500medium">Departure Time: {ride.departure_time}</Text>
                <Button title="View All Rides" onPress={() => router.push('/(root)/rides')} />
            </View>
        </SafeAreaView>
    );
}