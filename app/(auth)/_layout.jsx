import { Redirect, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { Loader } from "@/components/Loader";
// import { useGlobalContext } from "../../context/GlobalProvider";

const AuthLayout = () => {
  // const { loading, isLogged } = useGlobalContext();
  // const loading = false;
  // const isLogged = true;

  // if (!loading && isLogged) return <Redirect href="/home" />;

  return (
    <>
      <Stack>
        <Stack.Screen name="welcome" options={{ headerShown: false }} />
        <Stack.Screen name="sign-up" options={{ headerShown: false }} />
        <Stack.Screen name="sign-in" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="light" backgroundColor="#161622" />
    </>
  );
};

export default AuthLayout;

// import { Tabs } from 'expo-router';
// import React from 'react';
// import { Platform } from 'react-native';
// import { Colors } from '@/constants/Colors';
// import { useColorScheme } from 'react-native';

// export default function AuthLayout() {
//   const colorScheme = useColorScheme();

//   return (
//     <Tabs
//       screenOptions={{
//         tabBarActiveTintColor: Colors[colorScheme ?? 'dark'].tint,
//         headerShown: false,
//         tabBarStyle: Platform.select({
//           ios: {
//             // Use a transparent background on iOS to show the blur effect
//             position: 'absolute',
//           },
//           default: {},
//         }),
//       }}>
//       <Tabs.Screen
//         name="sign-in"
//         options={{
//           title: 'Sign in',

//         }}
//       />
//       <Tabs.Screen
//         name="sign-up"
//         options={{
//           title: 'Sign up',
//         }}
//       />
//     </Tabs>
//   );
// }
