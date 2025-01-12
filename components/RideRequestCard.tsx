import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { MatchedRide, Ride, RideRequest } from '@/types/type';
import { icons } from '@/constants';
import Maps from '@/components/Maps';

type Props = {
    ride: RideRequest;
    onPress: () => void;
    containerStyles?: string;
    showMap?: boolean;
    showImage?: boolean;
};

const getStatusStyle = (status: string) => {
    switch (status) {
        case 'active':
            return 'bg-green-500 text-white';
        case 'accepted':
            return 'bg-green-500 text-white';
        case 'cancelled':
            return 'bg-red text-white';
        case 'rejected':
            return 'bg-red text-white';
        case 'completed':
            return 'bg-yellow-400 text-white';
        default:
            return 'bg-graysecondary text-white';
    }
};

export default function RideRequestCard({ ride, onPress, containerStyles, showMap, showImage }: Props) {
    return (
        <View className={`bg-white p-4 rounded-xl shadow-sm w-full ${containerStyles}`}>
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

            <View className="flex flex-row justify-between items-center mb-2">
                <Text className={`px-3 py-1 rounded-full text-sm font-plusjakartasans_500medium ${getStatusStyle(ride.status)}`}>
                    {ride.status.charAt(0).toUpperCase() + ride.status.slice(1)}
                </Text>
            </View>

            {showImage && (
                <Image source={{
                    uri: `https://maps.geoapify.com/v1/staticmap?style=osm-bright&width=600&height=400&center=lonlat:${ride.destination_location.longitude},${ride.destination_location.latitude}&zoom=14&apiKey=${process.env.EXPO_PUBLIC_GEOAPIFY_API_KEY}`,
                }}
                    className="w-full h-[190px] rounded-lg"
                />)}

            {showMap && (
                <View className="h-72 mb-3 rounded-lg overflow-hidden">
                    <Maps
                        sourceLocation={ride.source_location}
                        destinationLocation={ride.destination_location}
                    // walkingPoints={'sourceWalkingTime' in ride ? [
                    // {
                    //     start: { latitude: ride.source_location.latitude, longitude: ride.source_location.longitude },
                    //     end: { latitude: ride.destination_location.latitude, longitude: ride.destination_location.longitude }
                    // }
                    // ] : undefined}
                    />
                </View>
            )}

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
                        {ride.seat_required} {ride.seat_required == 1 ? 'seat' : 'seats'}
                    </Text>
                </View>
                <TouchableOpacity onPress={onPress}>
                    <Text className="text-primary font-plusjakartasans_600semibold">
                        View Details
                    </Text>
                </TouchableOpacity>
            </View>
            {/* {'sourceWalkingTime' in ride && (ride.sourceWalkingTime > 0 || ride.destinationWalkingTime > 0) && (
        <View className="mt-2 pt-2 border-t border-gray-100">
          <Text className="text-xs text-gray font-plusjakartasans">
            {ride.sourceWalkingTime > 0 && `${Math.round(ride.sourceWalkingTime / 60)} min walk to pickup`}
            {ride.sourceWalkingTime > 0 && ride.destinationWalkingTime > 0 && ' • '}
            {ride.destinationWalkingTime > 0 && `${Math.round(ride.destinationWalkingTime / 60)} min walk from drop-off`}
          </Text>
        </View>
      )} */}
        </View>
    );
}