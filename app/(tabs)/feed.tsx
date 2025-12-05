import Colors from "@/constants/Colors";
import { Keyboard, KeyboardAvoidingView, Pressable, ScrollView } from "react-native";
import { View } from "react-native";
import ToastManager from "toastify-react-native/components/ToastManager";

export default function FeedScreen(){
    return (
        <KeyboardAvoidingView style={{flex: 1}}>
              <ScrollView style={{backgroundColor: Colors.creme}}>
              <Pressable onPress={() => Keyboard.dismiss()} style={{ flex: 1 }}>
                oi
        </Pressable>
        </ScrollView>
        <ToastManager />
        </KeyboardAvoidingView>

    )
}