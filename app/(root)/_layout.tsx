import { Stack } from "expo-router";

const Layout = () => {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="maps" options={{ headerShown: false }} />
      <Stack.Screen name="publish-ride" options={{ headerShown: false }} />
      <Stack.Screen name="request-ride" options={{ headerShown: false }} />
    </Stack>
  );
};

export default Layout;