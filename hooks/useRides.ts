import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Ride, Location, MatchedRide } from "@/types/type";

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

export function useRides() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const fetchAvailableRides = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("rides")
        .select("*")
        .eq("status", "active")
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

  const requestRide = async (
    rideId: string,
    requestData: {
      seat_required: number;
      source_location: Location;
      destination_location: Location;
      departure_time: Date;
    }
  ) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("ride_requests")
        .insert([
          {
            ride_id: rideId,
            ...requestData,
            status: "pending",
          },
        ])
        .select()
        .single();

      if (error) throw error;

      // Send notification to publisher
      await supabase.from("notifications").insert([
        {
          user_id: data.publisher_id,
          type: "ride_request",
          content: "New ride request received",
          ride_request_id: data.id,
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

  return {
    publishRide,
    fetchAvailableRides,
    publishedRideByMe,
    searchRides,
    requestRide,
    isLoading,
    error,
  };
}

