import { Image, TouchableOpacity, Text, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "@/constants";
import Button from "@/components/Button";
import Octicons from "@expo/vector-icons/Octicons";
import "@/global.css";
import { router } from "expo-router";
import Feather from "@expo/vector-icons/Feather";


const Home = () => {

  const handleSignOut = () => {};

  const RequestaRide = () => {
    router.push("/(root)/request-ride" as any);
  };
  const PublishaRide = () => {
    router.push("/(root)/publish-ride" as any);
  };

  return (
    <SafeAreaView className="h-full flex-1 flex justify-center items-center">
      <View className="flex-1 flex justify-around items-center w-full px-4">
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

        <View className=" flex justify-center items-center w-full">
          <Image source={images.Ride} className="" />
          <Button
            title="Request a ride"
            containerStyles={"mt-5"}
            onPress={() => RequestaRide()}
          />
          <Button
            title="Publish a ride"
            containerStyles={"mt-5"}
            isSecondary={true}
            onPress={() => PublishaRide()}
          />
        </View>

        
      </View>
    </SafeAreaView>
  );
};

export default Home;
