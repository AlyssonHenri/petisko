import { Image, Keyboard, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, ActivityIndicator } from 'react-native';
import { Text, View } from '@/components/Themed';
import Colors from '@/constants/Colors';
import LoginInput from '@/components/custom-login-input';
import loginUser from '@/services/login';
import { useState } from 'react';
import { router } from 'expo-router';

export default function LoginScreen() {
  const [user, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLoginPress = async (user: string, password: string) => {
    setLoading(true);
    setError('');

    try {
      await loginUser({ "username": user, "password": password });
      router.push('/profile');
    } catch (err) {
      console.error('Erro no login:', err);
      setError('Falha no login. Verifique suas credenciais e conexão.');
    } finally {
      setLoading(false);
    }
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
            <LoginInput outputFunc={(dado) => { setUsername(dado) }} placeholder='Digite seu usuário' errorMessage='O usuário precisa estar digitado.' />
            <LoginInput outputFunc={(dado) => setPassword(dado)} isPasswd={true} placeholder='Digite sua senha' errorMessage='O usuário precisa estar digitado.' />
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <TouchableOpacity onPress={() => router.push('/register')}>
            <Text style={styles.registerText}>Cadastre-se</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleLoginPress(user, password)}
            style={[styles.loginButton, loading && styles.loginButtonDisabled]}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={Colors.creme} />
            ) : (
              <Text style={styles.loginButtonText}>Login</Text>
            )}
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
