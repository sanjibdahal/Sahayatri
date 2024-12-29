import { View, FlatList, Text, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import { Location } from '@/types/type';
import InputField from './InputField';
import search from "@/constants/icons"

const ORS_API_KEY = process.env.EXPO_PUBLIC_DIRECTION_API_KEY;

interface ORSFeature {
    properties: {
        label: string;
        name: string;
    };
    geometry: {
        coordinates: [number, number];
    };
}

interface ORSResponse {
    features: ORSFeature[];
}

type Props = {
    onLocationSelect: (location: Location) => void;
    placeholder?: string;
    value: string;
};

export default function LocationSearch({ onLocationSelect, placeholder, value }: Props) {
    const [query, setQuery] = useState('');
    const [predictions, setPredictions] = useState<ORSFeature[]>([]);

    useEffect(() => {
        if (query.length > 2) {
            searchLocations();
        } else {
            setPredictions([]);
        }
    }, [query]);

    const searchLocations = async () => {
        try {
            const response = await fetch(
                `https://api.openrouteservice.org/geocode/search?api_key=${ORS_API_KEY}&text=${encodeURIComponent(query)}`,
                {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    }
                }
            );

            const data: ORSResponse = await response.json();
            setPredictions(data.features);
        } catch (error) {
            console.error('Error searching locations:', error);
            setPredictions([]);
        }
    };

    return (
        <View>
            <View>
                <InputField
                    icon={"search"}
                    title='Destination'
                    placeholder={placeholder || "Search location"}
                    value={query}
                    onChangeText={setQuery}
                />
            </View>

            {predictions.length > 0 && (
                <FlatList
                    data={predictions}
                    keyExtractor={(item, index) => index.toString()}
                    style={{
                        backgroundColor: '#f2f2f2',
                        borderRadius: 8,
                        marginTop: 8,
                      }}
                    scrollEnabled={true}
                    nestedScrollEnabled={true}
                    keyboardShouldPersistTaps="handled"
                    renderItem={({ item }) => (
                        <TouchableOpacity
                        style={{
                            padding: 12,
                            borderBottomWidth: 1,
                            borderBottomColor: '#ffffff'
                          }}
                            onPress={() => {
                                onLocationSelect({
                                    latitude: item.geometry.coordinates[1],
                                    longitude: item.geometry.coordinates[0],
                                    address: item.properties.name
                                });
                                setQuery(item.properties.name);
                                setPredictions([]);
                            }}
                        >
                            <Text className="font-plusjakartasans">{item.properties.label}</Text>
                        </TouchableOpacity>
                    )}
                />
            )}
        </View>
    );
}