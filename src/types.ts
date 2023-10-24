import { StackNavigationProp } from "@react-navigation/stack"
import { RouteProp } from "@react-navigation/native"

export type RootStackParamList = {
  DisplayName: undefined
  Chat: { userName: string }
}

export type ChatScreenProps = {
  route: ChatScreenRouteProp
}

export type DisplayNameScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "DisplayName"
>

export type ChatScreenRouteProp = RouteProp<RootStackParamList, "Chat">
