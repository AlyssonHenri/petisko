import Colors from "@/constants/Colors";
import { Keyboard, KeyboardAvoidingView, Pressable, ScrollView } from "react-native";
import ToastManager from "toastify-react-native/components/ToastManager";
import TinderCard from '../../animation/tinderCard'

export default function FeedScreen(){
    return (
        <KeyboardAvoidingView style={{flex: 1}}>
            <ScrollView style={{backgroundColor: Colors.creme}}>
                <Pressable onPress={() => Keyboard.dismiss()} style={{ flex: 1 }}>
                        <TinderCard></TinderCard>
                </Pressable>
            </ScrollView>
        <ToastManager />
        </KeyboardAvoidingView>

    )
}