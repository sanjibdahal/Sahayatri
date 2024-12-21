// import { useUser } from "@clerk/clerk-expo";
import { Image, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import InputField from "@/components/InputField";

const Profile = () => {
  // const { user } = useUser();
  const user = {
    name: "Sanjib Dahal",
    primaryEmailAddress: {
      emailAddress: "sanjibdahal@gmail.com",
    },
    primaryPhoneNumber: {
      phoneNumber: "9841234567",
    },
    verified: false,
    externalAccounts: [
      {
        imageUrl:
          "https://firebasestorage.googleapis.com/v0/b/daily-algo.appspot.com/o/images%2Fsanjib.jpg?alt=media&token=ee62ded6-708d-43bf-a5b3-f04a36a22d6a",
      },
    ],
  };

  return (
    <SafeAreaView className="flex-1">
      <ScrollView
        className="px-5"
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <Text className="text-3xl font-plusjakartasans_600semibold my-5">
          My profile
        </Text>

        <View className="flex items-center justify-center my-5">
          <Image
            source={{
              uri: user?.externalAccounts[0]?.imageUrl ?? user?.imageUrl,
            }}
            style={{ width: 110, height: 110, borderRadius: 110 / 2 }}
            className=" rounded-full h-[110px] w-[110px] border-[3px] border-white shadow-sm shadow-neutral-300"
          />
        </View>

        <View className="flex flex-col items-start justify-center bg-white rounded-lg shadow-sm shadow-neutral-300 px-5 py-3">
          <View className="flex flex-col items-start justify-start w-full">
            <InputField
              title="Name"
              placeholder={user?.name || "Not Found"}
              containerStyle="w-full"
              inputStyle="p-3.5"
              editable={false}
            />

            <InputField
              title="Email"
              placeholder={
                user?.primaryEmailAddress?.emailAddress || "Not Found"
              }
              containerStyle="w-full"
              inputStyle="p-3.5"
              editable={false}
            />

            <InputField
              title="Phone"
              placeholder={user?.primaryPhoneNumber?.phoneNumber || "Not Found"}
              containerStyle="w-full"
              inputStyle="p-3.5"
              editable={false}
            />

            <Text className="text-lg color-graysecondary font-plusjakartasans_600semibold mb-1 ">
              Verification Status
            </Text>
            <View className="flex flex-row items-center justify-start w-full ">
              {user.verified ? (
                <>
                  <FontAwesome5 name="check-circle" size={18} color="#57BE5E" />
                  <Text className="text-xl color-primary font-plusjakartasans_600semibold ml-3">
                    Verified
                  </Text>
                </>
              ) : (
                <>
                  <FontAwesome6 name="circle-xmark" size={18} color="#FF0000" />
                  <Text className="text-xl color-red-500 font-plusjakartasans_600semibold ml-3">
                    Unverified
                  </Text>
                </>
              )}
            </View>

            <Text className="text-lg color-graysecondary font-plusjakartasans_600semibold mt-2 ">
              My Documents
            </Text>
            <View className="flex flex-row items-center justify-start w-full ">
              <Text className="text-xl color-graysecondary font-plusjakartasans_600semibold ml-3">
                No documents uploaded
              </Text>
            </View>

          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
