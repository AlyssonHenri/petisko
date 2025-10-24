import { View } from "@/components/Themed";
import getStates from "@/controllers/states-controller";
import { useEffect, useState } from "react";
import { Text } from "react-native";
import {Picker} from '@react-native-picker/picker';
import { IState } from "@/interfaces/country";

export default function SignInScreen() {
    const [stateList, setStateList] = useState<IState[]>([]);
    useEffect(()=> {
        getStates().then(statesApi => setStateList(statesApi))
    }, [])


    return (
        <View>
            <Picker
  selectedValue={'oi'}
  onValueChange={(itemValue, itemIndex) =>
    {}}>
        {stateList.map(state => (
  <Picker.Item
    key={state.id}
    label={state.name}
    value={state.abbreviation}
  />
))}
</Picker> 

        </View>
        )
}