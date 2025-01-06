import Loader from "@/components/Loader";
import { useAuth } from "@/context/AuthProvider";
import { Redirect, Stack } from "expo-router";

const Layout = () => {

  const { session, loading } = useAuth();

  if (loading) {
    return <Loader isLoading={loading} />;
  }

  if (!session) {
    return <Redirect href={'/(auth)/sign-up'} />;
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="maps" options={{ headerShown: false }} />
      <Stack.Screen name="publish-ride" options={{ headerShown: false }} />
      <Stack.Screen name="published-ride" options={{ headerShown: false }} />
      <Stack.Screen name="request-ride" options={{ headerShown: false }} />
    </Stack>
  );
};

export default Layout;