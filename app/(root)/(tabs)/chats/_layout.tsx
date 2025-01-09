import { Stack } from "expo-router";

export default function ChatLayout() {
  return (
    <Stack>
    <Stack.Screen
      name="chat" 
      options={{
        headerShown: false, // Hides the header for this screen
      }}
    />
    <Stack.Screen
        name="[chatId]"
        options={{
          title: "Chat",
          headerShown: true,
        }}
      />
  </Stack>
  );
}