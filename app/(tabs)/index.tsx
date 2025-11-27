import { Image, Keyboard, StyleSheet, TouchableOpacity, Pressable, ActivityIndicator } from 'react-native';
import { Text, View } from '@/components/Themed';
import Colors from '@/constants/Colors';
import LoginInput from '@/components/custom-login-input';
import loginUser from '@/services/login';
import { router } from 'expo-router';
import { SetStateAction, useEffect, useState, useMemo, useCallback } from 'react';
import CustomInput from '@/components/generic_input';


export default function LoginScreen() {
  const [user, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [passwordCheckTouched, setPasswordCheckTouched] = useState(false);

  const handleLoginPress = async (user: string, password: string) => {
    setLoading(true);
    setError('');

    try {
      await loginUser({ "username": user, "password": password });
      router.push('/profile');
    } catch (err) {
      console.error('Erro no login:', err);
      setError('Falha no login. Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  };

  return (
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
                onChangeText={(dado: SetStateAction<string>) => setUsername(dado)}
                onFocus={() => setPasswordCheckTouched(true)}
                placeholder='Digite seu login'
                //errorMessage={!passwordCheckError.isValid ? passwordCheckError.message : ''}
                iconName='account'
                value={user}
              />
              <CustomInput
                onChangeText={(dado: SetStateAction<string>) => setPassword(dado)}
                onFocus={() => setPasswordCheckTouched(true)}
                isPassword={true} 
                placeholder='Digite sua senha'
                //errorMessage={!passwordCheckError.isValid ? passwordCheckError.message : ''}
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
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={Colors.creme} size={'large'}/>
            ) : (
              <Text style={styles.loginButtonText}>Login</Text>
            )}
          </TouchableOpacity>

        </View>
      </View>
    </Pressable>
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
