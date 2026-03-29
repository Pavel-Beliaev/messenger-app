import {Button, FlatList, KeyboardAvoidingView, Platform, Text, TextInput, View} from "react-native";
import {io, Socket} from "socket.io-client";
import {useEffect, useState} from "react";

export default function Home() {
    const [socket, setSocket] = useState<null | Socket>(null)
    const [message,setMessage] = useState("")
    const [messages, setMessages] = useState<string[]>([])

    useEffect(() => {
        const newSocket = io("http://192.168.0.3:3000") // свой IP
        setSocket(newSocket)

        newSocket.on("connect", () => {
            console.log("Connected:", newSocket.id);
        })

        newSocket.on("message", (msg) => {
            setMessages((prev) => [...prev, msg]);
        })

        return () => {
            newSocket.disconnect()
        }
    }, []);

    const sendMessage = () => {
        if (!message.trim()) return

        socket?.emit("message", message)
        setMessage("")
    }

  return (
      <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
          <View style={{flex: 1, paddingHorizontal: 20, paddingVertical: 50}}>
              <FlatList
                  data={messages}
                  keyExtractor={(_, index) => index.toString()}
                  renderItem={({item}) => (
                      <Text style={{marginBottom: 10}}>{item}</Text>
                  )}
              />

              <TextInput
                  value={message}
                  onChangeText={setMessage}
                  placeholder={"New Message"}
                  style={{
                      borderWidth: 1,
                      padding: 10,
                      marginBottom: 10
                  }}
              />

              <Button title={"Send"} onPress={sendMessage}/>
          </View>
      </KeyboardAvoidingView>
  );
}