import { View, Text, ImageBackground, ScrollView, Image, Alert, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import Button from "@/components/Button";
import InputField from "@/components/InputField";
import { icons } from "@/constants";
import { router } from "expo-router";
import { supabase } from "@/lib/supabase";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { decode } from "base64-arraybuffer";

export default function SignUp() {


  const [form, setForm] = useState({
    name: "",
    email: "",
    phonenumber: "",
    password: "",
    // photo_url: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
      aspect: [1, 1],
    });
  
    if (!result.canceled) {
      setImage(result.assets[0].uri); // Access URI from assets array
      console.log("Image selected: ", result.assets[0].uri);
    } else {
      console.log("Image selection canceled");
    }
  };

   const uploadImage = async (uri: string) => {
    try {
      const base64 = await FileSystem.readAsStringAsync(uri, { encoding: 'base64' });
      const fileName = `img_${Date.now()}`;
  
      const { data, error } = await supabase.storage
        .from('photos')
        .upload(fileName, decode(base64), {
          contentType: "image/jpeg",
        });
        console.log("File uploaded")
      if (error) {
        throw new Error(`Network request failed during image upload. ${error}`); // Throw an error if the upload fails
      }
  
      // Generate and return the public URL of the uploaded image
      const publicUrl = supabase.storage.from("photos").getPublicUrl(fileName);
      return publicUrl.data.publicUrl;
    } catch (error: any) {
      console.error("Image upload failed:", error.message || error);
      throw error;
    }
  };

  const submitForm = async () => {
    if (form.name === "" || form.email === "" || form.phonenumber === "" || form.password === "" || image === null) {
      Alert.alert("Error", "All fields are required.");
      return;
    }

    try {
      setIsSubmitting(true);

      const photo_url = await uploadImage(image);
      console.log("Photo URL: ", photo_url);

      // Call Supabase sign-up
      const { data, error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: {
            name: form.name, 
            phone_number: form.phonenumber,
            photo_url: photo_url,
          }
        }
      });

      if (error) {
        Alert.alert("Sign-Up Error", error.message);
      } else {
        
        router.push({pathname: "/(auth)/verify", params: {email: form.email}});
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };


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

            <TouchableOpacity onPress={() => pickImage()} className="w-24 h-24 rounded-full">
              <Image
                source={image ? { uri: image } : icons.addimage}
                className="w-24 h-24 rounded-full border-primary border-2 bg-gray-200"
                style={{ resizeMode: "cover" }}
              />
            </TouchableOpacity>

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
         
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
