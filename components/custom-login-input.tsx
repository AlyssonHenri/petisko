import { StyleSheet, View } from "react-native"
//import { Input, Icon } from '@rneui/themed';
import Colors from "@/constants/Colors";
import { useState } from "react";
import { TextInput, useTheme } from "react-native-paper";
import { MD3LightTheme } from "react-native-paper";


export default function LoginInput({placeholder, errorMessage, isPasswd = false, outputFunc }:{
    placeholder: string, 
    errorMessage: string, 
    isPasswd?: boolean, 
    outputFunc: (value: string) => void
  })
  {
    const [value, setValue] = useState('')
    const [isTouched, setTouched] = useState(false)
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


    return (
      <View>
        <TextInput
          style={styles.input}
          mode="outlined"
          placeholder={placeholder}
          value={value}
          onChangeText={(text) => {
            setValue(text);
            outputFunc(text);
          }}
          onBlur={() => setTouched(true)}
          error={value.length === 0 && isTouched}
          secureTextEntry={isPasswd}
          keyboardType="default"
          left={
            <TextInput.Icon
              icon={isPasswd ? "lock" : "account"}
              color={Colors.laranja}
            />
          }
          outlineColor={Colors.laranja}
          activeOutlineColor={Colors.laranja}
          selectionColor={Colors.laranja}
          theme={theme} 
        />
      </View>
    )
  }

const styles = StyleSheet.create({
  input: {
    fontFamily: 'PoppinsRegular',
  }

});