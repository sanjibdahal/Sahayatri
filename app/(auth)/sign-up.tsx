import { View, Text, ImageBackground, ScrollView, Image, Alert, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import Button from "@/components/Button";
import InputField from "@/components/InputField";
import { ReactNativeModal } from "react-native-modal";
import { icons } from "@/constants";
import { router } from "expo-router";
import { supabase } from "@/lib/supabase";
// import * as ImagePicker from "expo-image-picker";

export default function SignUp() {


  const [form, setForm] = useState({
    name: "",
    email: "",
    phonenumber: "",
    password: "",
    // photo_url: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  // const [image, setImage] = useState<string | null>(null);
  const [verification, setVerification] = useState({
    state: "default",
    error: "",
    code: "",
  });

  // const pickImage = async () => {
  //   const result = await ImagePicker.launchImageLibraryAsync({
  //     allowsEditing: true,
  //     quality: 1,
  //   });
  
  //   if (!result.canceled && result.assets && result.assets.length > 0) {
  //     setImage(result.assets[0].uri); // Access URI from assets array
  //   } else {
  //     console.log("Image selection canceled");
  //   }
  // };

  const submitForm = async () => {
    if (form.name === "" || form.phonenumber === "" || form.email === "" || form.password === "") {
      Alert.alert("Error", "All fields are required.");
      return;
    }
    router.push("/(auth)/verify" as any);

    try {
      setIsSubmitting(true);

      // let imageUrl = null;
      // if (image) {
      //   imageUrl = await uploadImage(image);
      // }
      // Call Supabase sign-up
      const { data, error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: { name: form.name, phone: form.phonenumber }, // Store additional data in user_metadata
        },
      });

      if (error) {
        Alert.alert("Sign-Up Error", error.message);
      } else {
        setVerification({ ...verification, state: "pending" });
        console.log("Data is this: ", data);
        Alert.alert("Success", "A verification link has been sent to your phone number.");
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onPressVerify = async () => {

    if (!verification.code) {
      Alert.alert("Error", "Please enter the OTP.");
      return;
    }
  
    try {
      // Verify the OTP using Supabase
      const { data, error } = await supabase.auth.verifyOtp({
        email: form.email,
        token: verification.code,
        type: 'email',
      });
  
      if (error) {
        setVerification({ ...verification, error: error.message, state: "failed" });
        Alert.alert("Error", error.message || "Invalid OTP.");
        return;
      }
  
      setVerification({ ...verification, state: "success" });
      setShowSuccessModal(true);
      Alert.alert("Success", "Your phone number has been verified.");
    } catch (error) {
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };

  // const uploadImage = async (uri: string) => {
  //   try {
  //     // Fetch the image file from the local URI
  //     const response = await fetch(uri);
  //     console.log("Image URI: ", uri)
  //     const blob = await response.blob(); // Convert the image file into a Blob
  //     console.log("Blob created")
  
  //     // Generate a unique filename using the current timestamp
  //     const fileName = `photos/${Date.now()}.jpg`;
  
  //     // Upload the Blob to the Supabase 'photos' bucket
  //     const { data, error } = await supabase.storage
  //       .from("photos") // Reference the bucket named "photos"
  //       .upload(fileName, blob, {
  //         contentType: "image/jpeg", // Specify the content type
  //       });
  //       console.log("File uploaded")
  //     if (error) {
  //       throw new Error('Network request failed during image upload'); // Throw an error if the upload fails
  //     }
  
  //     // Generate and return the public URL of the uploaded image
  //     const publicUrl = supabase.storage.from("photos").getPublicUrl(fileName);
  //     return publicUrl;
  //   } catch (error: any) {
  //     console.error("Image upload failed:", error.message || error); // Log the error
  //     throw error; // Propagate the error to the calling function
  //   }
  // };

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

            {/* <TouchableOpacity onPress={pickImage}>
              <Image
                source={image ? { uri: image } : icons.addimage}
                className="mt-10 w-24 h-24 rounded-full bg-gray-200"
                style={{ resizeMode: "cover" }}
              />
            </TouchableOpacity> */}

            <InputField
              title="Name"
              placeholder="Enter name"
              imageIcon={icons.person}
              
              value={form.name}
              onChangeText={(value) => setForm({ ...form, name: value })}
            />

            <InputField
              title="Email Address"
              placeholder="Enter email address"
              textContentType="emailAddress"
              keyboardType="email-address"
              imageIcon={icons.email}
              value={form.email}
              onChangeText={(value) => setForm({ ...form, email: value })}
            />

            <InputField
              title="Phone No."
              placeholder="Enter phone number"
              imageIcon={icons.phone}
              textContentType="telephoneNumber"
              keyboardType="phone-pad"
              value={form.phonenumber}
              onChangeText={(value) => setForm({ ...form, phonenumber: value })}
            />

            <InputField
              title="Email"
              placeholder="Enter email"
              icon={icons.email}
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
                imageIcon={icons.lock}
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
