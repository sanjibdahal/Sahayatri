import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthProvider";
import { Feather } from "@expo/vector-icons";
import { Message } from "@/types/type";

const ChatDetail = () => {
  const { chatId } = useLocalSearchParams();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    if (!user) return;

    fetchMessages();

    const channel = supabase
      .channel(`realtime:messages:chat_id=${chatId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: `chat_id=eq.${chatId}` },
        (payload: { new: Message }) => {
          setMessages((prev) => [...prev, payload.new]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [chatId, user]);

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("chat_id", chatId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error(error);
    } else {
      setMessages(data);
    }
  };

  const sendMessage = async () => {
    if (!newMessage || !user) return;

    const { error } = await supabase.from("messages").insert({
      chat_id: chatId,
      sender_id: user.id,
      message: newMessage,
    });

    if (error) {
      console.error(error);
    } else {
      setNewMessage("");
    }
  };

  return (
    <KeyboardAvoidingView behavior="padding" className="flex-1 p-5">
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}

        renderItem={({ item }) => (
          <View className={`max-w-[80%] text-white mb-2 flex items-center justify-center px-3 py-2 ${item.sender_id === user?.id ? "self-end bg-primary rounded-lg"
            : "self-start bg-gray rounded-lg"}`}>
            <Text className="text-white font-plusjakartasans_500medium">{item.message}</Text>
          </View>
        )}
      />
      <View className="flex flex-row items-center p-1">
        <TextInput
          placeholder="Type a message..."
          value={newMessage}
          onChangeText={setNewMessage}
          className="border border-primary font-plusjakartasans_500medium p-3 px-4 mr-2 rounded-lg flex-1"
        />
        <TouchableOpacity
          onPress={sendMessage}
          className="bg-green-500 rounded-lg px-3 py-3"
        >
          <Feather name="send" size={22} color="white" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChatDetail;