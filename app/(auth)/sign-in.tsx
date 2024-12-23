import {
  View,
  Text,
  ImageBackground,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import {Link} from "expo-router";
import Button from "@/components/Button";
import InputField from "@/components/InputField";
import { icons } from "@/constants";

export default function SignIn() {
  const [form, setForm] = useState({
    phonenumber: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitForm = () => {};

  return (
    <SafeAreaView className="h-full bg-white">
      <ScrollView className="h-full">
        <View className="w-full flex justify-center h-full">
          <View style={{ width: "100%", height: 250 }}>
            <ImageBackground
              source={require("@/assets/images/car.png")}
              className="h-full w-full"
            >
              <LinearGradient
                colors={["transparent", "rgba(255,255,255,1)"]}
                className="h-full w-full absolute top-0 left-0 right-0 bottom-0"
              />
            </ImageBackground>
          </View>
          <View className="w-full px-5">
            <Text className="text-3xl font-plusjakartasans_600semibold">
              Welcome Back 👋
            </Text>

            <InputField
              title="Phone No."
              placeholder="Enter phone number"
              icon={icons.phone}
              textContentType="telephoneNumber"
              keyboardType="phone-pad"
              value={form.phonenumber}
              onChangeText={(value) => setForm({ ...form, phonenumber: value })}
            />

            <InputField
              title="Password"
              placeholder="Enter password"
              icon={icons.lock}
              secureTextEntry={true}
              textContentType="password"
              value={form.password}
              onChangeText={(value) => setForm({ ...form, password: value })}
            />


            <Button
              title="Sign In"
              onPress={() => submitForm}
              containerStyles="mt-7"
              isLoading={isSubmitting}
            />

            <View className="flex justify-center pt-5 flex-row gap-2">
              <Text className="text-lg text-gray font-plusjakartasans">
                Don't have an account?
              </Text>
              <Link
                href={"/sign-up" as any}
                className="text-lg font-plusjakartasans_600semibold color-primary"
              >
                Signup
              </Link>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
