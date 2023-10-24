import React, { useState, useEffect } from "react"
import { PaperAirplaneIcon } from "react-native-heroicons/solid"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  SafeAreaView,
  KeyboardAvoidingView,
} from "react-native"
import { db } from "../config/firebaseConfig"
import {
  addDoc,
  collection,
  query,
  orderBy,
  limit,
  Timestamp,
  serverTimestamp,
  onSnapshot,
} from "firebase/firestore"
import { ChatScreenProps } from "../types"
import { theme } from "../styles/theme"

interface Message {
  id: string
  text: string
  createdAt: Timestamp
}

const ChatScreen: React.FC<ChatScreenProps> = ({ route }) => {
  const { userName } = route.params
  const [messages, setMessages] = useState<Message[]>([])
  const [message, setMessage] = useState("")

  const messagesQuery = query(
    collection(db, "yz-messages"),
    orderBy("createdAt", "asc"),
    limit(25)
  )

  useEffect(() => {
    const unsubscribe = onSnapshot(query(messagesQuery), (snapshot) => {
      let msgs: Message[] = []
      snapshot.forEach((doc) => {
        const data = doc.data() as Message
        msgs.push({ ...data })
      })
      setMessages(msgs.reverse())
    })

    return () => unsubscribe()
  }, [])

  const onSendPress = async () => {
    if (message.length > 0) {
      await addDoc(collection(db, "yz-messages"), {
        id: userName,
        text: message,
        createdAt: serverTimestamp(),
      })

      setMessage("")
    }
  }

  const renderItem = ({ item }: { item: Message }) => {
    const self = item.id === userName

    return (
      <View style={[styles.chatBubble, self && styles.chatBubbleSelf]}>
        <Text style={self && styles.chatBubbleTextSelf}>{item.text}</Text>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        style={styles.chatContainer}
        inverted
      />

      <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={190}
        style={styles.keyboardAvoid}
      >
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.inputField}
            value={message}
            onChangeText={(text) => setMessage(text)}
            placeholder="Type a message..."
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              message !== "" && styles.sendButtonDisabled,
            ]}
            onPress={onSendPress}
            disabled={message === ""}
          >
            <PaperAirplaneIcon style={styles.sendIcon} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  keyboardAvoid: {
    height: 50,
    zIndex: 2,
  },
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  chatContainer: {
    paddingHorizontal: 20,
    marginBottom: 10,
    zIndex: 1,
  },
  chatBubble: {
    alignSelf: "flex-start",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginVertical: 6,
    backgroundColor: "#efefef",
  },
  chatBubbleSelf: {
    alignSelf: "flex-end",
    backgroundColor: theme.colors.primary,
  },
  chatBubbleTextSelf: {
    color: "white",
  },
  inputContainer: {
    height: 80,
    flexDirection: "row",
    paddingHorizontal: 32,
    paddingBottom: 12,
    justifyContent: "space-between",
    alignItems: "center",
    borderTopColor: "#ccc",
    borderTopWidth: 1,
    backgroundColor: "white",
    zIndex: 2,
  },
  inputField: {
    flex: 1,
    marginRight: 10,
    paddingVertical: 10,
    paddingLeft: 10,
    paddingRight: 20,
  },
  sendButton: {
    justifyContent: "center",
    alignItems: "center",
    width: 38,
    height: 38,
    borderRadius: 25,
    backgroundColor: "#ccc",
  },
  sendButtonDisabled: {
    backgroundColor: theme.colors.primary,
  },
  sendIcon: {
    color: "white",
    width: 24,
    height: 24,
  },
})

export default ChatScreen
