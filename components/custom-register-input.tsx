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
                        inputContainerStyle={styles.inputContainer}
                        placeholder={placeholder}
                        placeholderTextColor={Colors.amarelo}
                        selectionColor={Colors.laranja}
                        errorStyle={{ color: 'red' }}
                        errorMessage={value.length == 0 && isTouched ? errorMessage : ''}
                        onBlur={() => setTouched(true)} 
                        onChangeText={(text: string)=> setValue(text)}
                        keyboardType="default"     
                        secureTextEntry={isPasswd} 
                    />
            </View>)
    
}


const styles = StyleSheet.create({
  input: {
    fontFamily: 'PoppinsRegular',
    backgroundColor: 'white',
    borderWidth: 2,
    borderRadius: 10,
    borderColor: Colors.amarelo,
    paddingLeft: 20,
    height: 50,
    color: Colors.amarelo
  },
  inputContainer: {
    borderBottomWidth: 0,
  }

});
