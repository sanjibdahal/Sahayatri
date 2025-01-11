import { useState, useEffect } from "react";
import { Image, TouchableOpacity, FlatList, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "@/lib/supabase";
import { useRouter, Link } from "expo-router";
import { useAuth } from "@/context/AuthProvider";

import { icons } from "@/constants";

type Chat = {
  id: string;
  user_1_id: string;
  user_2_id: string;
  other_user?: {
    name: string;
    photo_url: string;
  } | null;
};

const ChatList = () => {
  const { user, loading } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  // const router = useRouter();

  useEffect(() => {
    if (!loading) fetchChats();
  }, [loading]);

  const fetchChats = async () => {
    if (!user) return;
  
    const { data, error } = await supabase
      .from("chats")
      .select(`
        id,
        user_1_id,
        user_2_id,
        users2:user_2_id (id, name, photo_url),
        users1:user_1_id (id, name, photo_url)
      `)
      .or(`user_1_id.eq.${user.id},user_2_id.eq.${user.id}`);
  
    if (error) {
      console.error(error);
      return;
    }

    // console.log("Chats data:", data);
  
    const processedChats: Chat[] = data.map((chat) => {
      const isUser1 = chat.user_1_id === user.id;
  
      return {
        id: chat.id,
        user_1_id: chat.user_1_id,
        user_2_id: chat.user_2_id,
        other_user: isUser1 ? chat.users2 : chat.users1, // Set the other_user field
      };
    });

    // console.log("Processed chats:", processedChats);
  
    setChats(processedChats);
    setIsLoading(false);
  };
  

  // const handleChatPress = (chatId: string) => {
  //   router.push({
  //     pathname: `root/tabs/chat/${chatId}:chat`,
  //   });
  // };

  // useEffect(() => {
  //   console.log("Chats data:", chats);
  // }, [chats]);

  return (
    <SafeAreaView className="flex-1 p-5">
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
              // console.log("Item in render:", item);
              const otherUser = item.other_user;
              // console.log("User in render:", otherUser);
              if (!otherUser) {
                return (
                  <View className="flex-row items-center p-3 border-b">
                    <Text className="text-lg">Unknown User</Text>
                  </View>
                );
              }
              const { name, photo_url } = otherUser;
              return (
                <Link
                  href={{
                    pathname: `/(tabs)/chats/[chatId]`,
                    params: { chatId: item.id },
                  }}
                  asChild
                >
                  <TouchableOpacity>
                  <View className="flex-row items-center p-3 border-b">
                    {otherUser.photo_url && (
                      <Image
                        source={{ uri: otherUser.photo_url }}
                        style={{ width: 40, height: 40, borderRadius: 20 }}
                      />
                    )}
                    <Text className="text-lg ml-3">{otherUser.name}</Text>
                  </View>
                  </TouchableOpacity>
                </Link>
              );
            }}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ChatList;