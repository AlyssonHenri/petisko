import { Image, Keyboard, StyleSheet, TouchableOpacity, Pressable, ActivityIndicator, KeyboardAvoidingView, ScrollView } from 'react-native';
import { Text, View } from '@/components/Themed';
import Colors from '@/constants/Colors';
import LoginInput from '@/components/custom-login-input';
import loginUser from '@/services/login';
import { router, useFocusEffect } from 'expo-router';
import React, { SetStateAction, useEffect, useState, useMemo, useCallback } from 'react';
import CustomInput from '@/components/generic_input';
import ToastManager, { Toast } from 'toastify-react-native'
import { useNavbarStore } from './_layout';


export default function LoginScreen() {
  const [user, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [userError, setUserError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordCheckTouched, setPasswordCheckTouched] = useState(false);

  useFocusEffect(React.useCallback(() => {
    useNavbarStore.getState().setActive(false);
    setPassword('')
    setUsername('')

  }, []));

  const validateFields = () => {
    let valid = true;
    if (!user) {
      setUserError('O nome de usuário é obrigatório.');
      valid = false;
    } else {
      setUserError('');
    }

    if (!password) {
      setPasswordError('A senha é obrigatória.');
      valid = false;
    } else {
      setPasswordError('');
    }
    return valid;
  }

  const handleLoginPress = async (user: string, password: string) => {
    if (!validateFields()) {
      return;
    }
    setLoading(true);

    const res = await loginUser({ "username": user, "password": password });

    if (res.success === true) {
      Toast.show({
        type: 'success',
        text1: 'Sucesso',
        text2: 'Login realizado com sucesso',
        position: 'bottom',
        visibilityTime: 1800,
        autoHide: true,

      })

      setTimeout(() => router.push('/profile'), 2000)



    } else {
      Toast.show({
        type: 'error',
        text1: 'Falha no login',
        text2: res.data[0],
        position: 'bottom',
        visibilityTime: 5000,
        autoHide: true,

      })
    }
    setLoading(false);

  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }}>
      <ScrollView style={{ backgroundColor: Colors.creme }}>
        <Pressable onPress={() => Keyboard.dismiss()} style={{ flex: 1 }}>
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
                <CustomInput
                  onChangeText={(dado: SetStateAction<string>) => {
                    setUsername(dado);
                    if (userError) validateFields();
                  }}
                  onFocus={() => setPasswordCheckTouched(true)}
                  placeholder='Digite seu login'
                  errorMessage={userError}
                  iconName='account'
                  value={user}
                />
                <CustomInput
                  onChangeText={(dado: SetStateAction<string>) => {
                    setPassword(dado);
                    if (passwordError) validateFields();
                  }}
                  onFocus={() => setPasswordCheckTouched(true)}
                  isPassword={true}
                  placeholder='Digite sua senha'
                  errorMessage={passwordError}
                  iconName='lock-check'
                  value={password}
                />
              </View>

              {/* {error ? <Text style={styles.errorText}>{error}</Text> : null} */}

              <TouchableOpacity onPress={() => router.push('/register')}>
                <Text style={styles.registerText}>Cadastre-se</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleLoginPress(user, password)}
                style={[styles.loginButton, loading && styles.loginButtonDisabled]}
              //disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color={Colors.creme} size={'large'} />
                ) : (
                  <Text style={styles.loginButtonText}>Login</Text>
                )}
              </TouchableOpacity>

            </View>
          </View>
        </Pressable>
      </ScrollView>
      <ToastManager />

    </KeyboardAvoidingView>
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
  header: {
    marginTop: 20,
    alignItems: 'center',
    gap: 50,
    backgroundColor: Colors.creme
  },
  title: {
    fontSize: 36,
    color: Colors.laranja,
    backgroundColor: Colors.creme
  },
  titleLogo: {
    fontFamily: 'PoppinsBold'
  },
  titleLogoMini: {
    fontFamily: 'PoppinsSemiBold'
  },
  content: {
    flexGrow: 1,
    backgroundColor: Colors.creme
  },
  fieldsContainer: {
    paddingTop: 60,
    gap: 10,
    backgroundColor: Colors.creme
  },
  registerText: {
    textAlign: 'right',
    fontFamily: 'PoppinsSemiBold',
    marginRight: 10,
    marginTop: 10,
    color: Colors.azul
  },
  loginButton: {
    backgroundColor: Colors.laranja,
    padding: 10,
    borderRadius: 100,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginHorizontal: 100,
    marginTop: 30,
  },
  loginButtonText: {
    textAlign: 'center',
    fontFamily: 'PoppinsMedium',
    fontSize: 25,
    color: Colors.creme
  },
  loginButtonDisabled: {
    backgroundColor: '#cccccc',
    shadowOpacity: 0.1,
    elevation: 2,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    fontFamily: 'PoppinsRegular',
    fontSize: 14,
    marginVertical: 10,
  },
  input: {
    fontFamily: 'PoppinsRegular'
  }
});
