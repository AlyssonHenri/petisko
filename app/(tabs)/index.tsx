import { Image, StyleSheet, TouchableOpacity } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { Input, Icon } from '@rneui/themed';




export default function TabOneScreen() {
  return (
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
          <Input inputStyle={styles.input}
            placeholder='Digite seu usuário'
            selectionColor={Colors.laranja}
            leftIcon={
              <Icon
                name='person'
                size={24}
                color={Colors.laranja}
              />
            }
          />

        <Input inputStyle={styles.input}
                placeholder='Digite sua senha'
                selectionColor={Colors.laranja}
                leftIcon={
                  <Icon
                    name='lock'
                    size={24}
                    color={Colors.laranja}
                  />
                }
              />
        </View>

        <TouchableOpacity>
            <Text style={{textAlign: 'right', fontFamily: 'PoppinsSemiBold', marginRight: 10, color: Colors.azul}}>Esqueci minha senha</Text>
        </TouchableOpacity>

         <TouchableOpacity style={{backgroundColor: Colors.laranja, padding: 10, borderRadius: 100,     boxShadow: '0px 2px 5px 0px rgba(0, 0, 0, 0.5)', marginHorizontal: 100, marginTop: 50, 
}}>
            <Text style={{textAlign: 'center', fontFamily: 'PoppinsMedium', fontSize: 25, color: Colors.creme}}>Login</Text>
        </TouchableOpacity>

      </View>
    </View>
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
