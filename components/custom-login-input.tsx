import { StyleSheet, View } from "react-native"
import { Input, Icon } from '@rneui/themed';
import Colors from "@/constants/Colors";
import { useState } from "react";

export default function LoginInput({placeholder, errorMessage, isPasswd = false, outputFunc }:
    {placeholder: string, errorMessage: string, isPasswd?: boolean, outputFunc: (value: string) => void}){
        const [value, setValue] = useState('')
        const [isTouched, setTouched] = useState(false)

        return (
            <View>
                <Input inputStyle={styles.input}
                        placeholder={placeholder}
                        selectionColor={Colors.laranja}
                        errorStyle={{ color: 'red' }}
                        errorMessage={value.length == 0 && isTouched ? errorMessage : ''}
                        onBlur={() => setTouched(true)} 
                        onChangeText={(text: string)=> setValue(text)}
                        keyboardType="default"     
                        secureTextEntry={isPasswd} 
                        leftIcon={
                        <Icon
                            name= {isPasswd ? 'lock' : 'person'} 
                            size={24}
                            color={Colors.laranja}
                        />
                        }
                    />
            </View>)
    
}


const styles = StyleSheet.create({
  input: {
    fontFamily: 'PoppinsRegular'
  }


});
