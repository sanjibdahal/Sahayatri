import { ScrollView, Image, Text, View } from 'react-native'
import React, { useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { icons } from '@/constants'
import CustomButton from '@/components/CustomButton'
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthProvider';
import { router } from 'expo-router'

const Notifications = () => {

    const { user } = useAuth();
    const [notifications, setNotifications] = useState<any>([]);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const { data, error } = await supabase
                    .from('notifications')
                    .select('*')
                    .eq('rider_id', user?.id);

                if (error) throw error;
                setNotifications(data);
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        };

        fetchNotifications();
    }, [user?.id]);

    const handleNotificationClick = async (notification: any) => {
        try {
            await supabase
                .from('notifications')
                .delete()
                .eq('id', notification.id);
            setNotifications((prev: any) =>
                prev.filter((notif: any) => notif.id !== notification.id)
            );

            if (notification.type === 'Ride Request Accepted' || 
                notification.type === 'Ride Request Rejected') {
                router.push('/rides');
            }
        } catch (error) {
            console.error('Error deleting notification:', error);
        }
    };


    const confirmRequest = async (notification: any) => {
        try {
            const { data: rideRequest, error: rideRequestError } = await supabase
                .from('ride_request')
                .update({ status: 'accepted' })
                .eq('ride_id', notification.ride_id)
                .select()
                .single();

            if (rideRequestError) throw rideRequestError;

            const { data: ride, error: rideError } = await supabase
                .from('rides')
                .update({ status: 'booked' })
                .eq('id', rideRequest.ride_id)
                .select()
                .single();

            if (rideError) throw rideError;

            await supabase.from('notifications').insert([
                {
                    user_id: user?.id,
                    rider_id: rideRequest.user_id,
                    type: 'Ride Request Accepted',
                    content: `Your ride request has been accepted by ${user?.user_metadata.name}`,
                    ride_id: rideRequest.ride_id,
                },
            ]);

            await supabase.from('notifications').delete().eq('id', notification.id);

            setNotifications((prev: any) =>
                prev.filter((notif: any) => notif.id !== notification.id)
            );
        } catch (error) {
            console.error('Error confirming request:', error);
        }
    };

    const declineRequest = async (notification: any) => {
        try {
            const { data: rideRequest, error: rideRequestError } = await supabase
                .from('ride_request')
                .update({ status: 'rejected' })
                .eq('ride_id', notification.ride_id)
                .eq('status', 'pending')
                .select()
                .single();

            if (rideRequestError) throw rideRequestError;

            await supabase.from('notifications').insert([
                {
                    user_id: user?.id,
                    rider_id: rideRequest.user_id,
                    type: 'Ride Request Rejected',
                    content: `Your ride request has been rejected by ${user?.user_metadata.name}`,
                    ride_id: rideRequest.ride_id,
                },
            ]);

            await supabase.from('notifications').delete().eq('id', notification.id);

            setNotifications((prev: any) =>
                prev.filter((notif: any) => notif.id !== notification.id)
            );
        } catch (error) {
            console.error('Error declining request:', error);
        }
    };


    return (
        <SafeAreaView className="flex-1">
            <ScrollView
                className="px-5"
                contentContainerStyle={{ paddingBottom: 120 }}
            >
                <Text className="text-3xl font-plusjakartasans_600semibold my-5">
                    Notifications
                </Text>

                {notifications.length === 0 ? (
                    <View className="flex items-center justify-center mt-10">
                        <Text className="text-lg font-plusjakartasans_500medium text-gray-500">
                            No notifications yet
                        </Text>
                    </View>
                ) : (
                    notifications.map((notification: any) => (
                        <View
                            key={notification.id}
                            className="flex flex-row bg-white rounded-lg shadow-sm shadow-neutral-300 px-3 py-3 flex-1 mb-4"
                        >
                            {notification.type === 'Ride Request Rejected' ? (<Image source={icons.reject} className="mr-2" />) : (
                                <Image source={icons.confirm} className="mr-2" />
                            )}
                            <View className='flex-1'>
                                <Text className="text-lg flex-1 w-full font-plusjakartasans_600semibold">
                                    {notification.type}
                                </Text>
                                <Text className="text-md flex font-plusjakartasans_500medium ">
                                    {notification.content}
                                </Text>
                                {notification.type === 'Ride Request Accepted' && (
                                    <CustomButton
                                        title="View Ride"
                                        containerStyles="flex-1 py-3 mt-2"
                                        onPress={() => handleNotificationClick(notification)}
                                    />
                                )}
                                {notification.type === 'Ride Request Rejected' && (
                                    <CustomButton
                                        title="View Available Rides"
                                        containerStyles="flex-1 py-3 mt-2"
                                        onPress={() => handleNotificationClick(notification)}
                                    />
                                )}
                                {notification.type === 'Request for a ride' && (
                                    <View className="flex flex-row gap-x-2 mt-2">
                                        <CustomButton
                                            title="Confirm"
                                            containerStyles="flex-1 py-3"
                                            onPress={() => confirmRequest(notification)}
                                        />
                                        <CustomButton
                                            title="Decline"
                                            containerStyles="flex-1 bg-red"
                                            onPress={() => declineRequest(notification)}
                                        />
                                    </View>
                                )}
                            </View>
                        </View>
                    ))
                )}
            </ScrollView>
        </SafeAreaView>
    )
}

export default Notifications

