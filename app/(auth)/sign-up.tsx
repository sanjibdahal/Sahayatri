import { View, Text, ImageBackground, ScrollView, Image, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import Button from "@/components/Button";
import InputField from "@/components/InputField";
import { ReactNativeModal } from "react-native-modal";
import { icons } from "@/constants";
import { router } from "expo-router";
import { supabase } from "@/lib/supabase"; // Import Supabase client

export default function SignUp() {
  const [form, setForm] = useState({
    name: "",
    phonenumber: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [verification, setVerification] = useState({
    state: "default",
    error: "",
    code: "",
  });

  const submitForm = async () => {
    if (form.name === "" || form.phonenumber === "" || form.password === "") {
      Alert.alert("Error", "All fields are required.");
      return;
    }

    try {
      setIsSubmitting(true);

      // Call Supabase sign-up
      const { data, error } = await supabase.auth.signUp({
        phone: form.phonenumber,
        password: form.password,
        options: {
          data: { name: form.name }, // Store additional data in user_metadata
        },
      });

      if (error) {
        Alert.alert("Sign-Up Error", error.message);
      } else {
        setVerification({ ...verification, state: "pending" });
        Alert.alert("Success", "A verification link has been sent to your phone number.");
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onPressVerify = () => {
    if (verification.code === "") {
      setVerification({
        ...verification,
        state: "success",
      });
      setShowSuccessModal(true);
    } else {
      setVerification({
        ...verification,
        error: "Invalid OTP. Please try again.",
        state: "failed",
      });
      setShowSuccessModal(true);
    }
  };

  const [showSuccessModal, setShowSuccessModal] = useState(false);


  return (
    <SafeAreaView className="h-full bg-white">
      <ScrollView className="h-full">
        <View className="w-full flex justify-center h-full pb-4">
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
              Create Your Account
            </Text>

            <Image source={icons.addimage} className="mt-10" />

            <InputField
              title="Name"
              placeholder="Enter name"
              icon={icons.person}
              value={form.name}
              onChangeText={(value) => setForm({ ...form, name: value })}
            />

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
              title="Sign Up"
              onPress={() => submitForm()}
              containerStyles="mt-7"
              isLoading={isSubmitting}
            />

            <View className="flex justify-center pt-5 flex-row gap-2 pb-3 mb-4">
              <Text className="text-lg text-gray font-plusjakartasans">
                Already have an account?
              </Text>
              <Link
                href={"/sign-in" as any}
                className="text-lg font-plusjakartasans_600semibold color-primary"
              >
                Login
              </Link>
            </View>
          </View>
          <ReactNativeModal
          isVisible={verification.state === "pending"}
          // onBackdropPress={() =>
          //   setVerification({ ...verification, state: "default" })
          // }
          onModalHide={() => {
            if (verification.state === "success") {
              setShowSuccessModal(true);
            }
          }}
        >
          <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
            <Text className="font-plusjakartasans_700bold text-2xl mb-2">
              Verification
            </Text>
            <Text className="font-plusjakartasans_500medium mb-5">
              We've sent a verification code to {form.phonenumber}.
            </Text>
            <InputField
              title={"Code"}
              icon={icons.lock}
              placeholder={"12345"}
              value={verification.code}
              keyboardType="numeric"
              onChangeText={(code) =>
                setVerification({ ...verification, code })
              }
            />
            {verification.error && (
              <Text className="text-red-500 text-sm mt-1">
                {verification.error}
              </Text>
            )}
            <Button
              title="Verify Email"
              onPress={onPressVerify}
              className="mt-5 bg-success-500"
            />
          </View>
        </ReactNativeModal>
        <ReactNativeModal isVisible={showSuccessModal}>
          <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
            <Image
              source={icons.checkmark}
              className="w-[110px] h-[110px] mx-auto my-5 bg-primary rounded-full p-3"
            />
            <Text className="text-3xl font-plusjakartasans_700bold text-center">
              Verified
            </Text>
            <Text className="text-base text-gray-400 font-plusjakartasans_700bold text-center mt-2">
              You have successfully verified your account.
            </Text>
            <Button
              title="Browse Home"
              onPress={() => router.push('/(root)/(tabs)/home' as any)}
              className="mt-5"
            />
          </View>
        </ReactNativeModal>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
