import { useState } from 'react';
// import { supabase } from '@/lib/supabase';
import { Ride } from '@/types/type';

export function useRides() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const publishRide = async (rideData: any) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('rides')
        .insert([{
          vehicle_type: rideData.vehicleType,
          vehicle_plate: rideData.vehiclePlate,
          seats_available: parseInt(rideData.seatsAvailable),
          source_location: rideData.sourceLocation,
          destination_location: rideData.destinationLocation,
          departure_time: rideData.departureTime.toISOString(),
          status: 'active'
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAvailableRides = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('rides')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Ride[];
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    publishRide,
    fetchAvailableRides,
    isLoading,
    error
  };
}
// Dummy supabase client for testing purposes
export const supabase = {
    from: (table: string) => ({
        insert: (data: any) => ({
            select: () => ({
                single: async () => {
                    // Simulate a successful insert operation
                    return { data: { id: 1, ...data[0] }, error: null };
                }
            })
        }),
        select: (columns: string) => ({
            eq: (column: string, value: any) => ({
                order: (column: string, options: { ascending: boolean }) => ({
                    async then(resolve: (value: any) => void) {
                        // Simulate fetching data
                        resolve({
                            data: [
                                {
                                    id: 1,
                                    vehicle_type: 'Car',
                                    vehicle_plate: 'ABC123',
                                    seats_available: 3,
                                    source_location: {address: "Cafeteria, Nepal", latitude: 27.6217536, longitude: 85.5371502},
                                    destination_location: {address: 'Kathmandu University, Dhulikhel, Nepal', latitude: 27.617999, longitude: 85.5371502},
                                    departure_time: new Date().toISOString(),
                                    status: 'active',
                                    created_at: new Date().toISOString()
                                }
                            ],
                            error: null
                        });
                    }
                })
            })
        })
    })
};