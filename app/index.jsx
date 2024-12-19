import { View, StyleSheet, Text, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";
import Button from "@/components/Button";
import { images } from "../constants";
import { router } from "expo-router";


export default function OnBoardingScreen() {
  return (
    <SafeAreaView className="h-full w-full"> 
      <View className="flex-1 flex justify-center items-center px-3">
        <View className="w-full h-44 flex justify-center items-center mt-20">
          <Image source={images.OnBoardingCar} className="h-full w-full"/>
        </View>
        <View className="flex-1 justify-center items-center w-full">
          <Text className="text-4xl font-plusjakartasans_600semibold">
            Share the Road,
          </Text>
          <Text className="text-4xl font-plusjakartasans_600semibold">
            Share the Ride
          </Text>
          <Text className="text-lg font-plusjakartasans text-gray">
            Share rides and connect with your {"\n"} college community with Sahayatri 
          </Text>

          <Button title="Get Started" onPress={() => router.push("/(auth)/sign-in")} containerStyles={'mt-20 w-full'} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    fontFamily: "PlusJakartaSans",
  },
  backgroundImage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 250,
    width: "100%",
    padding: 20, 
  },
});
