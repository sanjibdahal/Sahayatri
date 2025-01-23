import { View, Text, ImageBackground, ScrollView, Alert, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Link, router } from "expo-router";
import Button from "@/components/Button";
import InputField from "@/components/InputField";
import { icons } from "@/constants";
import { supabase } from "@/lib/supabase";

export default function SignIn() {

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitForm = async () => {
    if (form.email === "" || form.password === "") {
      Alert.alert("Error", "All fields are required.");
      return;
    }
    try {
      setIsSubmitting(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password
      });

      if (error) {
        console.error("Error signing in:", error);
        Alert.alert(`Error: ${error.message}`);
        return;
      }
      if (data.session) {
        router.replace('/(root)/home');
        console.log("User signed in successfully.");
      }
    } catch (error) {
      console.error("Error signing in:", error);
      Alert.alert("Error", "Failed to sign in. Please try again.");
    } finally {
      setIsSubmitting(false);
    }

  };

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
              title="Email Address"
              placeholder="Enter email address"
              imageIcon={icons.email}
              textContentType="emailAddress"
              keyboardType="email-address"
              value={form.email}
              onChangeText={(value) => setForm({ ...form, email: value })}
            />

            <InputField
              title="Password"
              placeholder="Enter password"
              imageIcon={icons.lock}
              secureTextEntry={true}
              textContentType="password"
              value={form.password}
              onChangeText={(value) => setForm({ ...form, password: value })}
            />

            {/* <TouchableOpacity
              onPress={async () => {

                let { data, error } = await supabase.auth.resetPasswordForEmail(form.email);
                console.log(data, error);

              }}
            >
              <Text className="font-plusjakartasans_600semibold color-primary self-end">Forgot password?</Text>
            </TouchableOpacity> */}
            <Button
              title="Sign In"
              onPress={() => submitForm()}
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
