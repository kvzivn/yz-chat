import React from "react"
import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import DisplayNameScreen from "./src/screens/DisplayNameScreen"
import ChatScreen from "./src/screens/ChatScreen"
import { RootStackParamList } from "./src/types"
import { theme } from "./src/styles/theme"

const Stack = createStackNavigator<RootStackParamList>()

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="DisplayName">
        <Stack.Screen
          name="DisplayName"
          component={DisplayNameScreen}
          options={{
            title: "Welcome!",
            headerTitleStyle: { fontSize: 24 },
            headerTitleAlign: "center",
            headerTintColor: "white",
            headerStyle: { height: 120, backgroundColor: theme.colors.primary },
          }}
        />
        <Stack.Screen
          name="Chat"
          component={ChatScreen}
          options={{
            title: "Chat",
            headerTitleStyle: { fontSize: 24 },
            headerTitleAlign: "center",
            headerTintColor: "white",
            headerStyle: {
              height: 120,
              backgroundColor: theme.colors.primary,
            },
            headerBackTitleVisible: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App
