import { Image, Keyboard, StyleSheet, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { Input, Icon } from '@rneui/themed';
import RegisterInput from '@/components/custom-register-input';
import { useState } from 'react';




export default function RegisterScreen() {
  const [user, setUsername] = useState('')
  const [password, setPassword] = useState('')

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={styles.header}>
            <Text style={[styles.titleLogo, styles.title]}>
                pet<Text style={[styles.titleLogoMini, styles.title]}>isko</Text>
            </Text>
            <Image style={{height: 60, width: 50}} resizeMode='contain' source={require('../../assets/logo/logo.png')} />
        </View>
        <View style={styles.content}>

            <Text style={[styles.titleList]}>
                cadastro
            </Text>

          <View style={styles.fieldsContainer}>
            <RegisterInput outputFunc={(dado)=> setUsername(dado)} placeholder='Digite seu nome' errorMessage='O campo deve estar preenchido.' />
            <RegisterInput outputFunc={(dado)=> setPassword(dado)} placeholder='Digite seu CPF' errorMessage='O campo deve estar preenchido.' />
            <RegisterInput outputFunc={(dado)=> setPassword(dado)} placeholder='Digite o usuário' errorMessage='O campo deve estar preenchido.' />
            <RegisterInput outputFunc={(dado)=> setPassword(dado)} isPasswd={true} placeholder='Digite a senha' errorMessage='O campo deve estar preenchido.' />
            <RegisterInput outputFunc={(dado)=> setPassword(dado)} placeholder='Cidade' errorMessage='O campo deve estar preenchido.' />
            <RegisterInput outputFunc={(dado)=> setPassword(dado)} placeholder='Estado' errorMessage='O campo deve estar preenchido.' />
          </View>

          <TouchableOpacity style={{backgroundColor: Colors.laranja, padding: 10, borderRadius: 100,     boxShadow: '0px 2px 5px 0px rgba(0, 0, 0, 0.5)', marginHorizontal: 100, marginTop: 50, 
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
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignContent: 'flex-start',
    marginTop: 20,
    alignItems: 'center',
    gap: 2,
    paddingTop: 10
  },
   titleLogo: {
    fontFamily: 'PoppinsBold'
  },
  titleLogoMini: {
    fontFamily: 'PoppinsSemiBold'
  },
  titleList: {
    fontFamily: 'PoppinsExtraLight',
    paddingTop: 20,
    fontSize: 60,
    color: Colors.laranja
  },

  content: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column'
  },

  fieldsContainer: {
    paddingTop: 10,
    gap: 0,
  },
  input: {
    fontFamily: 'PoppinsRegular'
  }

});
