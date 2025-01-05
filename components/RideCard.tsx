import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Ride } from '@/types/type';
import { icons } from '@/constants';

type Props = {
    ride: Ride;
    onPress: () => void;
};

export default function RideCard({ ride, onPress }: Props) {
    return (
        <TouchableOpacity
            className="bg-white p-4 rounded-xl shadow-sm w-full"
            onPress={onPress}
        >
            <View className="flex flex-col gap-y-3 flex-1 mb-2">
                <View className="flex flex-row items-center gap-x-2">
                    <Image source={icons.to} className="w-6 h-6" />
                    <Text className="text-md font-plusjakartasans_600semibold" numberOfLines={1}>
                        {ride.source_location.address}
                    </Text>
                </View>

                <View className="flex flex-row items-center gap-x-2">
                    <Image source={icons.point} className="w-6 h-6" />
                    <Text className="text-md font-plusjakartasans_600semibold" numberOfLines={1}>
                        {ride.destination_location.address}
                    </Text>
                </View>
            </View>
            
            <Image
                source={{
                    uri: `https://maps.geoapify.com/v1/staticmap?style=osm-bright&width=600&height=400&center=lonlat:${ride.destination_location.longitude},${ride.destination_location.latitude}&zoom=14&apiKey=${process.env.EXPO_PUBLIC_GEOAPIFY_API_KEY}`,
                }}
                className="w-full h-[190px] rounded-lg"
            />

            <View className="flex-row items-center mb-2 mt-2">
                <Feather name="clock" size={16} color="gray" />
                <Text className="text-gray ml-2 font-plusjakartasans">
                    {ride.departure_time}
                </Text>
            </View>

            <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                    <Feather name="users" size={16} color="gray" />
                    <Text className="text-gray ml-2 font-plusjakartasans">
                        {ride.no_of_seats_available} {ride.no_of_seats_available==1? 'seat' : 'seats'}
                    </Text>
                </View>
                <Text className="text-primary font-plusjakartasans_600semibold">
                    View Details
                </Text>
            </View>
        </TouchableOpacity>
    );
}