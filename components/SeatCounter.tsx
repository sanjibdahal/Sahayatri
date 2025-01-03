import { View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

type Props = {
  value: number;
  onChange: (value: number) => void;
  vehicleType: string;
};

export default function SeatCounter({ value, onChange, vehicleType}: Props) {
  
  const maxSeats = vehicleType === 'bike' ? 1 : 3;
  const minSeats = 1;

  const handleDecrement = () => {
    if (value > minSeats) {
      onChange(value - 1);
    }
  };

  const handleIncrement = () => {
    if (value < maxSeats) {
      onChange(value + 1);
    }
  };

  return (
    <View className="mb-4">
      <Text className="text-lg font-plusjakartasans_600semibold color-graysecondary mb-2">Available Seats</Text>
      <View className="flex-row items-center bg-gray-100 rounded-lg p-2">
        <TouchableOpacity
          className={`p-2 rounded-lg ${value <= minSeats ? 'opacity-50' : ''}`}
          onPress={handleDecrement}
          disabled={value <= minSeats}
        >
          <Feather name="minus" size={24} color="#57BE5E" />
        </TouchableOpacity>
        
        <Text className="flex-1 text-center text-xl font-plusjakartasans_600semibold">
          {value}
        </Text>
        
        <TouchableOpacity
          className={`p-2 rounded-lg ${value >= maxSeats ? 'opacity-50' : ''}`}
          onPress={handleIncrement}
          disabled={value >= maxSeats}
        >
          <Feather name="plus" size={24} color="#57BE5E" />
        </TouchableOpacity>
      </View>
    </View>
  );
}