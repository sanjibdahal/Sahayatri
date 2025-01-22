import { Stack } from "expo-router";
import { View, Image, Text } from "react-native";

export default function ChatLayout() {
  return (
    <Stack>
    <Stack.Screen
      name="chat" 
      options={{
        headerShown: false,
      }}
    />
    <Stack.Screen
        name="[chatId]"
        options={({ route }) => ({
          headerTitle: () => {
            console.log('Route params: ', route.params);
            const { name, photo_url } = route.params as any;
            return (
              <View className="flex-row items-center">
                {photo_url && (
                  <Image
                    source={{ uri: photo_url }}
                    className="w-8 h-8 rounded-full mr-2"
                  />
                )}
                <Text className="text-lg font-plusjakartasans_600semibold">
                  {name || 'Chat'}
                </Text>
              </View>
            );
          },
          headerBackButtonMenuEnabled: true,
        })}
      />
  </Stack>
  );
}