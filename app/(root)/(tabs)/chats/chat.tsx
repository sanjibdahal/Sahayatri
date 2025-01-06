import { useState, useEffect } from "react";
import { Image, TouchableOpacity, FlatList, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "@/lib/supabase";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/AuthProvider";

import { icons } from "@/constants";

type Chat = {
  id: string;
  user_1_id: string;
  user_2_id: string;
  users: {
    name: string;
    photo_url: string;
  }[];
};

const ChatList = () => {
  const { user, loading } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!loading) fetchChats();
  }, [loading]);

  const fetchChats = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("chats")
      .select("id, user_1_id, user_2_id, users!user_2_id (name, photo_url)")
      .or(`user_1_id.eq.${user.id},user_2_id.eq.${user.id}`);

      console.log("Chats Data:", data);
      console.log("Chats Error:", error);

    if (error) {
      console.error(error);
    } else {
      setChats(data);
    }
    setIsLoading(false);
  };

  const handleChatPress = (chatId: string) => {
    router.push({
      pathname: `root/tabs/chat/${chatId}:chat`,
    });
  };

  useEffect(() => {
    console.log("Chats data:", chats);
  }, [chats]);

  return (
    <SafeAreaView className="flex-1 bg-white p-5">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Text className="text-2xl font-plusjakartasans_700bold">Chat</Text>
        {chats.length === 0 ? (
          <View className="flex-1 h-fit flex justify-center items-center">
            <Image
              source={icons.message}
              alt="message"
              className="w-full h-40"
              resizeMode="contain"
            />
            <Text className="text-3xl font-plusjakartasans_700bold mt-3">
              No Messages Yet
            </Text>
            <Text className="text-base mt-2 text-center px-7 font-plusjakartasans_500medium color-gray">
              No messages in your inbox, yet!
            </Text>
          </View>
        ) : (
          <FlatList
            data={chats}
            keyExtractor={(item, index) => item.id || index.toString()}
            scrollEnabled={false}
            renderItem={({ item }) => {
              console.log("Item in render:", item);
              const user = item.users[0];
              console.log("User in render:", user);
              if (!user) {
                return (
                  <View className="flex-row items-center p-3 border-b">
                    <Text className="text-lg">Unknown User</Text>
                  </View>
                );
              }
              const { name, photo_url } = user;
              return (
                <TouchableOpacity onPress={() => handleChatPress(item.id)}>
                  <View className="flex-row items-center p-3 border-b">
                    {photo_url && (
                      <Image
                        source={{ uri: photo_url }}
                        style={{ width: 40, height: 40, borderRadius: 20 }}
                      />
                    )}
                    <Text className="text-lg ml-3">{name}</Text>
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ChatList;