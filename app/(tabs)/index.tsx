import { Image, Keyboard, StyleSheet, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { Text, View } from '@/components/Themed';
import Colors from '@/constants/Colors';
import LoginInput from '@/components/custom-login-input';
import { useState } from 'react';
import { router } from 'expo-router';
import loginUser from '@/services/login';



export default function LoginScreen() {
  const [user, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLoginPress = (user: string, password: string) => {
    loginUser({"username": user, "password": password})
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={[styles.titleLogo, styles.title]}>
              pet<Text style={[styles.titleLogoMini, styles.title]}>isko</Text>
            </Text>
          </View>
          <Image source={require('../../assets/logo/logo.png')} />
        </View>
        <View style={styles.content}>

          <View style={styles.fieldsContainer}>
          <LoginInput outputFunc={(dado)=> {setUsername(dado)}} placeholder='Digite seu usuário' errorMessage='O usuário precisa estar digitado.' />
          <LoginInput outputFunc={(dado)=> setPassword(dado)} isPasswd={true} placeholder='Digite sua senha' errorMessage='O usuário precisa estar digitado.' />

          </View>

          <TouchableOpacity onPress={() => router.push('/register')}>
              <Text style={{textAlign: 'right', fontFamily: 'PoppinsSemiBold', marginRight: 10, color: Colors.azul}}>Cadastre-se</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => handleLoginPress(user, password)}  style={{backgroundColor: Colors.laranja, padding: 10, borderRadius: 100,     boxShadow: '0px 2px 5px 0px rgba(0, 0, 0, 0.5)', marginHorizontal: 100, marginTop: 50, 
  }}>
              <Text style={{textAlign: 'center', fontFamily: 'PoppinsMedium', fontSize: 25, color: Colors.creme}}>Login</Text>
          </TouchableOpacity>

        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    padding: 20,
    backgroundColor: Colors.creme
  },
  title: {
    fontSize: 36,
    color: Colors.laranja
  },

 
  header: {
    marginTop: 20,
    alignItems: 'center',
    gap: 50
  },
   titleLogo: {
    fontFamily: 'PoppinsBold'
  },
  titleLogoMini: {
    fontFamily: 'PoppinsSemiBold'
  },

  content: {
    flexGrow: 1
  },

  fieldsContainer: {
    paddingTop: 60,
    gap: 0,
  },
  input: {
    fontFamily: 'PoppinsRegular'
  }


});
