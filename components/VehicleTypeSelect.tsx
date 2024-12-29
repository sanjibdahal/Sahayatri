import { View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export default function VehicleTypeSelect({ value, onChange }: Props) {
  const options = [
    { value: 'car', label: 'Car', icon: 'car-side' },
    { value: 'bike', label: 'Bike', icon: 'motorcycle' },
  ];

  return (
    <View className="mb-4">
      <Text className="text-lg font-plusjakartasans mb-2">Vehicle Type</Text>
      <View className="flex-row">
        {options.map((option) => (
          <TouchableOpacity
            key={option.value}
            className={`flex-1 p-3 rounded-lg mr-2 flex-row items-center justify-center ${
              value === option.value ? 'bg-primary' : 'bg-gray-100'
            }`}
            onPress={() => onChange(option.value)}
          >
            <FontAwesome6 name={option.icon as any} size={20} color={value === option.value ? 'white' : 'gray'} />
            <Text
              className={`ml-2 font-plusjakartasans ${
                value === option.value ? 'text-white' : 'text-gray-600'
              }`}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}