import { TextInputProps, TouchableOpacityProps } from "react-native";

export interface User {
  id: string;
  name: string;
  phone_number: string;
  photo_url: string;
  created_at: Date;
}

export interface Ride {
  id: string;
  rider_id: string;
  source_location: Location;
  destination_location: Location;
  departure_time: Date;
  vehicle_type: 'car' | 'bike' | 'scooter';
  seats_available: number;
  vehicle_number: string;
  status: 'active' | 'completed' | 'cancelled';
  created_at: Date;
}

export interface RideRequest {
  id: string;
  ride_id: string;
  requester_id: string;
  seats_needed: number;
  status: 'pending' | 'accepted' | 'rejected';
  source: Location;
  destination: Location;
  departure_time: Date;
  created_at: Date;
}

export interface Location {
  latitude: number;
  longitude: number;
  address?: string | "Current Location";
}

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: Date;
}
declare interface InputFieldProps extends TextInputProps {
  title: string;
  icon?: any;
  imageIcon?: any;
  secureTextEntry?: boolean;
  labelStyle?: string;
  containerStyle?: string;
  inputStyle?: string;
  iconStyle?: string;
  className?: string;
}

declare interface ButtonProps extends TouchableOpacityProps {
  title: string;
  containerStyles?: string;
  textStyles?: string;
  isLoading?: boolean;
  isSecondary?: boolean;
}

declare interface FormFieldProps extends TextInputProps {
  title: string;
  value: string;
  placeholder: string;
  handleChangeText: (value: string) => void;
  otherStyles?: string;
}