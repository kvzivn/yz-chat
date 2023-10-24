import React, { useState } from "react"
import { View, Text, TextInput, Pressable } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { DisplayNameScreenNavigationProp } from "../types"
import { StyleSheet } from "react-native"
import { theme } from "../styles/theme"

const DisplayNameScreen: React.FC = () => {
  const navigation = useNavigation<DisplayNameScreenNavigationProp>()
  const [name, setName] = useState("")

  const onSubmit = () => {
    navigation.navigate("Chat", { userName: name })
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Please enter your name:</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Fredrik Meurling"
      />
      <Pressable style={styles.button} onPress={() => onSubmit()}>
        <Text style={styles.buttonText}>Submit</Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 28,
    textAlign: "center",
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: "black",
  },
  buttonText: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "gray",
    backgroundColor: "white",
    borderRadius: 4,
    borderWidth: 1,
    marginBottom: 28,
    paddingLeft: 10,
  },
})

export default DisplayNameScreen
