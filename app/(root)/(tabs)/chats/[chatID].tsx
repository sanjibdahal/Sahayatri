import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TextInput, Button, KeyboardAvoidingView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthProvider";

const ChatDetail = () => {
  const { chatId } = useLocalSearchParams();
  const { user } = useAuth();
  const [messages, setMessages] = useState<
    { id: string; sender_id: string; message: string; created_at: string }[]
  >([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    if (!user) return;

    fetchMessages();

    const channel = supabase
      .channel(`realtime:messages:chat_id=${chatId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: `chat_id=eq.${chatId}` },
        (payload: { new: { id: string; sender_id: string; message: string; created_at: string } }) => {
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
    <KeyboardAvoidingView behavior="padding" className="flex-1 bg-white p-5">
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className={`p-3 ${item.sender_id === user?.id ? "self-end" : "self-start"}`}>
            <Text>{item.message}</Text>
          </View>
        )}
      />
      <TextInput
        placeholder="Type a message..."
        value={newMessage}
        onChangeText={setNewMessage}
        className="border p-2 mb-3"
      />
      <Button title="Send" onPress={sendMessage} />
    </KeyboardAvoidingView>
  );
};

export default ChatDetail;