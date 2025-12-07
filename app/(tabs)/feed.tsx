import Colors from "@/constants/Colors";
import { Keyboard, KeyboardAvoidingView, Pressable, ScrollView } from "react-native";
import ToastManager from "toastify-react-native/components/ToastManager";
import TinderCard from '../../animation/TinderCard/tinderCard'
import { View } from "@/components/Themed";

export default function FeedScreen(){
    return (

        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <TinderCard></TinderCard>
        <ToastManager />
        </View>
      

    )
}