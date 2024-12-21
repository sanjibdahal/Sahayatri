import { Image, TouchableOpacity, Text, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "@/constants";
import Button from "@/components/Button";
import Octicons from "@expo/vector-icons/Octicons";
import "@/global.css";
import { router } from "expo-router";


const Home = () => {

  const handleSignOut = () => {};

  const BookaRide = () => {
    router.push("/(root)/maps");
  };
  const PublishaRide = () => {};

  return (
    <SafeAreaView className="h-full flex-1 flex justify-center items-center">
      <View className="flex-1 flex justify-center items-center w-full px-4">
        <View className="flex items-center flex-row justify-between w-full mb-10">
          <Text className="text-2xl font-plusjakartasans_500medium">
            Welcome,{"\n"}Sanjib Dahal
          </Text>

          <TouchableOpacity
            onPress={handleSignOut}
            className="place-content-end justify-center items-center px-4 py-3 border rounded-full"
          >
            <Octicons name="sign-out" className="font-bold" size={24} color="black" />
          </TouchableOpacity>
        </View>

        <Image source={images.Ride} className="mt-28" />
        <Button
          title="Book a ride"
          containerStyles={"mt-5"}
          onPress={() => BookaRide()}
        />
        <Button
          title="Publish a ride"
          containerStyles={"mt-5"}
          isSecondary={true}
          onPress={() => PublishaRide()}
        />
      </View>
    </SafeAreaView>
  );
};

export default Home;
