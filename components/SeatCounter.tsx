import { View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

type Props = {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
};

export default function SeatCounter({ value, onChange, min = 1, max = 3 }: Props) {
  const handleDecrement = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  const handleIncrement = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  return (
    <View className="mb-4">
      <Text className="text-lg font-plusjakartasans mb-2">Available Seats</Text>
      <View className="flex-row items-center bg-gray-100 rounded-lg p-2">
        <TouchableOpacity
          className={`p-2 rounded-lg ${value <= min ? 'opacity-50' : ''}`}
          onPress={handleDecrement}
          disabled={value <= min}
        >
          <Feather name="minus" size={24} color="#57BE5E" />
        </TouchableOpacity>
        
        <Text className="flex-1 text-center text-xl font-plusjakartasans_600semibold">
          {value}
        </Text>
        
        <TouchableOpacity
          className={`p-2 rounded-lg ${value >= max ? 'opacity-50' : ''}`}
          onPress={handleIncrement}
          disabled={value >= max}
        >
          <Feather name="plus" size={24} color="#57BE5E" />
        </TouchableOpacity>
      </View>
    </View>
  );
}