import { StyleSheet, View } from "react-native"
import Colors from "@/constants/Colors";
import { useState } from "react";
import { TextInput } from "react-native-paper";
import { MD3LightTheme } from "react-native-paper";


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
        const theme = {
        ...MD3LightTheme,
        colors: {
            ...MD3LightTheme.colors,
            primary: Colors.laranja,        
            outline: Colors.laranja,        
            onSurface: Colors.amarelo,       
            onSurfaceVariant: Colors.amarelo, 
            surface: 'white',                
            background: 'white',
        },
  fonts: {
    ...MD3LightTheme.fonts,
    bodyLarge: { ...MD3LightTheme.fonts.bodyLarge, fontFamily: "PoppinsRegular" },
  },
};


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

                <TextInput
                      style={styles.input}
                      mode="outlined"
                      label={placeholder}
                      value={value}
                      onChangeText={handleChangeText}
                      onBlur={handleBlur}
                      error={value.length === 0 && isTouched}
                      secureTextEntry={isPasswd}
                      keyboardType="default"
                      theme={theme} 

                    />
                {/* <Input inputStyle={styles.input}
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
                    /> */}
            </View>)
    
}


const styles = StyleSheet.create({
  input: {
    fontFamily: 'PoppinsRegular',
    backgroundColor: 'white',
    paddingLeft: 20,
    height: 50,
    color: Colors.amarelo
  },
  inputContainer: {
    borderBottomWidth: 0,
    width: '100%'
  }

});
