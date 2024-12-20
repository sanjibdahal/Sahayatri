import { Image, TouchableOpacity, Text, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "@/constants";
import Button from "@/components/Button";
import Octicons from "@expo/vector-icons/Octicons";

const Home = () => {

  const handleSignOut = () => {};

  return (
    <SafeAreaView className="h-full  flex-1 flex justify-center items-center">
      <View className="flex-1 flex justify-center items-center w-full px-4">
        <View className="flex items-center flex-row justify-between w-full">
          <Text className="text-2xl font-plusjakartasans_500medium">
            Welcome,{"\n"}Sanjib Dahal
          </Text>

          <TouchableOpacity
            onPress={handleSignOut}
            className="place-content-end justify-center items-center p-4 rounded-full bg-gray"
          >
            <Octicons name="sign-out" className="font-bold" size={24} color="black" />
          </TouchableOpacity>
        </View>

        <Image source={images.Ride} className="mt-28" />
        <Button
          title="Book a ride"
          containerStyles={"mt-5"}
          onPress={() => {}}
        />
        <Button
          title="Publish a ride"
          containerStyles={"mt-5"}
          isSecondary={true}
          onPress={() => {}}
        />
      </View>
    </SafeAreaView>
  );
};

export default Home;
