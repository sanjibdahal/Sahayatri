import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Ride, Location, MatchedRide, RideRequest } from "@/types/type";
import { useAuth } from "@/context/AuthProvider";

const EARTH_RADIUS = 6371; // Earth's radius in kilometers

function calculateDistance(point1: Location, point2: Location): number {
  const lat1 = (point1.latitude * Math.PI) / 180;
  const lat2 = (point2.latitude * Math.PI) / 180;
  const lon1 = (point1.longitude * Math.PI) / 180;
  const lon2 = (point2.longitude * Math.PI) / 180;

  const dLat = lat2 - lat1;
  const dLon = lon2 - lon1;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return EARTH_RADIUS * c * 1000; // Convert to meters
}

function calculateWalkingTime(distance: number): number {
  const avgWalkingSpeed = 1.4; // meters per second
  return Math.round(distance / avgWalkingSpeed);
}

const isWithinTimeRange = (time1: string, time2: string, rangeInHours = 2) => {
  const date1 = new Date(time1);
  const date2 = new Date(time2);
  const diffInHours = Math.abs(date1.getTime() - date2.getTime()) / (1000 * 60 * 60);
  return diffInHours <= rangeInHours;
};

export function useRides() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const publishRide = async (rideData: any) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("rides")
        .insert([
          {
            rider_id: rideData.riderId,
            vehicle_type: rideData.vehicleType,
            number_plate: rideData.number_plate,
            no_of_seats_available: parseInt(rideData.no_of_seats_available),
            source_location: rideData.sourceLocation,
            destination_location: rideData.destinationLocation,
            departure_time: rideData.departure_time,
            status: "active",
          },
        ])
        .select()
        .single();

      if (error) throw error;
      console.log("Data: ", data);
      return data;
    } catch (err: any) {
      setError(err.message);
      console.log("Error: ", err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAvailableRides = async (currentUserId: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("rides")
        .select("*")
        .eq("status", "active")
        .neq("rider_id", currentUserId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Ride[];
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const publishedRideByMe = async (riderId: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("rides")
        .select("*")
        .eq("rider_id", riderId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Ride[];
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const searchRides = async (searchParams: {
    source_location: Location;
    destination_location: Location;
    no_of_seats_available: number;
    departure_time: string;
  }) => {
    try {
      setIsLoading(true);
      const { data: availableRides, error } = await supabase
        .from("rides")
        .select("*")
        .eq("status", "active")
        .gte("no_of_seats_available", searchParams.no_of_seats_available)
        .gte("departure_time", searchParams.departure_time);

      if (error) throw error;

      // Filter and enhance rides with distance and walking information
      const matchedRides = (availableRides as Ride[])
        .map((ride) => {
          const sourceDistance = calculateDistance(
            searchParams.source_location,
            ride.source_location
          );
          const destinationDistance = calculateDistance(
            searchParams.destination_location,
            ride.destination_location
          );

          const enhancedRide = {
            ...ride,
            sourceDistance,
            destinationDistance,
            sourceWalkingTime: calculateWalkingTime(sourceDistance),
            destinationWalkingTime: calculateWalkingTime(destinationDistance),
            isExactMatch: sourceDistance < 50 && destinationDistance < 50,
            isNearbyMatch: sourceDistance < 500 && destinationDistance < 500,
          } as MatchedRide;

          console.log(`Ride ID: ${ride.id},dest dis: ${enhancedRide.destinationDistance} Source Walking Time: ${enhancedRide.sourceWalkingTime/60} mins, Destination Walking Time: ${enhancedRide.destinationWalkingTime/60} mins`);

          return enhancedRide;

        })
        .filter((ride) => ride.isNearbyMatch);

      return {
        exactMatches: matchedRides.filter((ride) => ride.isExactMatch),
        nearbyMatches: matchedRides.filter(
          (ride) => !ride.isExactMatch && ride.isNearbyMatch
        ),
      };
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const requestedRide = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("ride_request")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as RideRequest[];
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }

  const requestRide = async (rideData:any) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("ride_request")
        .insert([
          {
            ride_id: rideData.id,
            user_id: user?.id,
            source_location: rideData.source_location,
            destination_location: rideData.destination_location,
            departure_time: rideData.departure_time,
            seat_required: parseInt(rideData.no_of_seats_available),
            status: "pending",
          },
        ])
        .select()
        .single();

      if (error) throw error;

      // Send notification to publisher
      await supabase.from("notifications").insert([
        {
          user_id: user?.id,
          rider_id: rideData.rider_id,
          type: "Request for a ride",
          content: `You have a new ride request from ${user?.user_metadata.name}`,
          ride_id: rideData.id,
        },
      ]);

      return data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateRide = async (rideId: string, updateData: any) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("rides")
        .update({
          vehicle_type: updateData.vehicleType,
          number_plate: updateData.number_plate,
          no_of_seats_available: parseInt(updateData.no_of_seats_available),
          source_location: updateData.sourceLocation,
          destination_location: updateData.destinationLocation,
          departure_time: updateData.departure_time,
        })
        .eq('id', rideId)
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

  const cancelRide = async (rideId: string) => {
    try {
      setIsLoading(true);
      
      // Update ride status to cancelled
      const { error: rideError } = await supabase
        .from("rides")
        .update({ status: 'cancelled' })
        .eq('id', rideId);

      if (rideError) throw rideError;

      // Delete associated notifications
      const { error: notificationError } = await supabase
        .from("notifications")
        .delete()
        .eq('ride_id', rideId);

      if (notificationError) throw notificationError;

      // Delete associated ride requests
      const { error: requestError } = await supabase
        .from("ride_request")
        .delete()
        .eq('ride_id', rideId);

      if (requestError) throw requestError;

      return true;
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
    publishedRideByMe,
    searchRides,
    requestRide,
    requestedRide,
    updateRide,
    cancelRide,
    isLoading,
    error,
  };
}

