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
  QueryDocumentSnapshot,
  DocumentData,
  startAfter,
  getDocs,
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
  const [oldMessages, setOldMessages] = useState<Message[]>([])
  const [message, setMessage] = useState("")
  const [lastDoc, setLastDoc] =
    useState<QueryDocumentSnapshot<DocumentData> | null>(null)
  const [loadingMessages, setLoadingMessages] = useState(false)

  useEffect(() => {
    const messagesQuery = query(
      collection(db, "kvzivn-messages"),
      orderBy("createdAt", "desc"),
      limit(25)
    )

    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      let msgs: Message[] = []
      snapshot.forEach((doc) => {
        const data = doc.data() as Message
        msgs.push({ ...data })
      })
      setLastDoc(snapshot.docs[snapshot.docs.length - 1])
      setMessages(msgs)
    })

    return unsubscribe
  }, [])

  const loadMoreMessages = async () => {
    if (loadingMessages || !lastDoc) return

    setLoadingMessages(true)

    const moreMessagesQuery = query(
      collection(db, "kvzivn-messages"),
      orderBy("createdAt", "desc"),
      startAfter(lastDoc),
      limit(5)
    )

    const snapshot = await getDocs(moreMessagesQuery)

    if (!snapshot.empty) {
      let moreMessages: Message[] = []
      snapshot.docs.forEach((doc) => {
        const data = doc.data() as Message
        moreMessages.push({ ...data })
      })

      setOldMessages((prevMessages) => [...moreMessages, ...prevMessages])
      setLastDoc(snapshot.docs[snapshot.docs.length - 1])
    }
    setLoadingMessages(false)
  }

  const onSendPress = async () => {
    if (message.length > 0) {
      await addDoc(collection(db, "kvzivn-messages"), {
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
      {loadingMessages && (
        <Text style={styles.loadingText}>Loading more messages...</Text>
      )}
      <FlatList
        data={[...messages, ...oldMessages]}
        renderItem={renderItem}
        onEndReached={loadMoreMessages}
        onEndReachedThreshold={0.1}
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
  loadingText: {
    textAlign: "center",
    paddingVertical: 30,
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
    paddingHorizontal: 16,
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
