import { StyleSheet, View } from "react-native"
import { Input, Icon } from '@rneui/themed';
import Colors from "@/constants/Colors";
import { useState } from "react";

export default function LoginInput({
    placeholder, 
    errorMessage, 
    isPasswd = false, 
    outputFunc, 
    onFocus, 
    showError = false 
}: {
    placeholder: string, 
    errorMessage: string, 
    isPasswd?: boolean, 
    outputFunc: (value: string) => void,
    onFocus?: () => void,
    showError?: boolean
}){
        const [value, setValue] = useState('')
        const [isTouched, setTouched] = useState(false)

        const handleChangeText = (text: string) => {
            setValue(text);
            outputFunc(text);
        };

        const handleFocus = () => {
            if (onFocus) {
                onFocus();
            }
        };

        const handleBlur = () => {
            setTouched(true);
        };

        return (
            <View>
                <Input inputStyle={styles.input}
                        containerStyle={{paddingHorizontal: 0}}
                        inputContainerStyle={styles.inputContainer}
                        placeholder={placeholder}
                        placeholderTextColor={Colors.amarelo}
                        selectionColor={Colors.laranja}
                        errorStyle={{ color: 'red' }}
                        errorMessage={showError || (value.length == 0 && isTouched) ? errorMessage : ''}
                        onFocus={handleFocus}
                        onBlur={handleBlur} 
                        onChangeText={handleChangeText}
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
    width: '100%'
  }

});
