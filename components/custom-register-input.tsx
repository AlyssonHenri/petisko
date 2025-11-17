import { StyleSheet, View } from "react-native"
import Colors from "@/constants/Colors";
import { useState } from "react";
import { HelperText, TextInput } from "react-native-paper";
import { MD3LightTheme } from "react-native-paper";


export default function LoginInput({ placeholder, errorMessage, isPasswd = false, outputFunc, onFocus, showError = false 
} : {
    placeholder: string, 
    errorMessage: string, 
    isPasswd?: boolean, 
    outputFunc: (value: string) => void,
    onFocus?: () => void,
    showError?: boolean
}){
  const [value, setValue] = useState('')
  const [isTouched, setTouched] = useState(false)
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  
  const theme = {
    ...MD3LightTheme,
    roundness: 10,
    isV3: true,
    colors: {
        ...MD3LightTheme.colors,
        primary: Colors.amarelo,        
        outline: Colors.amarelo,        
        onSurface: Colors.amarelo,       
        onSurfaceVariant: Colors.amarelo, 
        surface: 'white',                
        background: 'white',
        error: Colors.amarelo,

    },
    fonts: {...MD3LightTheme.fonts,
            bodyLarge: { ...MD3LightTheme.fonts.bodyLarge, fontFamily: "PoppinsRegular", 'fontSize': 16 },
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
              placeholder={placeholder}
              outlineStyle={{ borderWidth: 2 }}
              value={value}
              contentStyle={{ paddingLeft: 0 }}
              onChangeText={handleChangeText}
              onFocus={handleFocus}
              onBlur={handleBlur}
              error={value.length === 0 && isTouched}
              secureTextEntry={secureTextEntry}
              autoCorrect={false}
              keyboardType="default"
              right={
              isPasswd ? 
              (<TextInput.Icon
              icon={secureTextEntry ? "eye-off" : "eye"}
              onPress={() => {
                setSecureTextEntry(!secureTextEntry);
                }}
              />) : null
                  
              }
              keyboardType="default"
              theme={theme} 
          />
        <HelperText 
          type="error" visible={isTouched}
          theme={{ colors: { error: 'red' }, }}
          style={{
            marginLeft: 1,
            paddingHorizontal: 5,
            fontFamily: 'PoppinsRegular',
            fontSize: 11
          }}
        >
          {errorMessage}
        </HelperText>
      </View>
  )
}

const styles = StyleSheet.create({
  input: {
    fontFamily: 'PoppinsRegular',
    backgroundColor: 'white',
    paddingLeft: 20,
    height: 50,
    fontSize: 18,
    color: Colors.amarelo,
  },
  inputContainer: {
    borderBottomWidth: 0,
    width: '100%'
  }

});