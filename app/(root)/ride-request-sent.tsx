import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '@/components/Button';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

export default function PublishedRide() {
    const router = useRouter();

    return (
        <SafeAreaView className='flex-1 bg-white'>
            <View className="flex-1 p-4 justify-center">
                <View className=" items-center">
                    <FontAwesome5 name="check-circle" size={100} color="#57BE5E" />
                    <Text className="text-2xl font-plusjakartasans_700bold mb-2">Ride Request Sent</Text>
                    <Text className="text-lg mb-4 font-plusjakartasans_500medium">Your ride request has been sent successfully. You will be notified when the driver accepts your request.</Text>
                </View>
                <Button title="View All Rides" onPress={() => router.push('/(root)/rides')} />
            </View>
        </SafeAreaView>
    );
}