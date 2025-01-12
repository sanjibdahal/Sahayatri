import { ActivityIndicator, Text, TouchableOpacity } from "react-native";
import React from "react";
import { ButtonProps } from "@/types/type";

const CustomButton = ({
  title,
  onPress,
  containerStyles,
  textStyles,
  isLoading,
  isSecondary,
}: ButtonProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className={`rounded-xl flex flex-row justify-center items-center w-full ${containerStyles} ${
        isLoading ? "opacity-50" : ""
      } ${isSecondary ? "bg-transparent border border-gray" : "bg-primary"}`}
      disabled={isLoading}
    >
      <Text className={`font-plusjakartasans_700bold text-xl ${textStyles} ${isSecondary ? "color-black" : "color-white"}`}>
        {title}
      </Text>

      {isLoading && (
        <ActivityIndicator
          animating={isLoading}
          color="#fff"
          size="small"
          className="ml-2"
        />
      )}
    </TouchableOpacity>
  );
};

export default CustomButton;