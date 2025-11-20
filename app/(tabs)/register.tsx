import { Image, Keyboard, StyleSheet, TouchableOpacity, Pressable, KeyboardAvoidingView, ScrollView, Platform, Alert } from 'react-native';
import { Text, View } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { SetStateAction, useEffect, useState, useMemo, useCallback } from 'react';
import getStates, { getCitiesFromState } from '@/controllers/states-controller';
import DropDownPicker from 'react-native-dropdown-picker';
import registerUser from '@/services/register';
import MaskInput from 'react-native-mask-input';
import loginUser from '@/services/login';
import { router } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import CustomInput from '@/components/generic_input'; 
import MaskedInput from '@/components/masked_input';
import Feather from 'react-native-vector-icons/Feather';

interface ValidationResult {
 isValid: boolean;
 message: string;
}

export default function RegisterScreen() {
  
  const [actualError, setActualError] = useState('');
  const [user, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');
  const [cpf, setCpf] = useState('');
  const [cpfMasked, setCpfMasked] = useState('');
  const [userName, setUserName] = useState('');
  const [openState, setOpenState] = useState(false);
  const [openCity, setOpenCity] = useState(false);
  const [state, setState] = useState<string | null>(null);
  const [city, setCity] = useState<string | null>(null);
  const [stateList, setStateList] = useState<{ label: string; value: string }[]>([]);
  const [cityList, setCityList] = useState<{ label: string; value: string }[]>([]);
  const [nameTouched, setNameTouched] = useState(false);
  const [cpfTouched, setCpfTouched] = useState(false);
  const [userNameTouched, setUserNameTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [passwordCheckTouched, setPasswordCheckTouched] = useState(false);
  const [stateTouched, setStateTouched] = useState(false);
  const [cityTouched, setCityTouched] = useState(false);

  useEffect(() => {
    getStates().then(statesApi => {
      const formatted = statesApi.map(state => ({
        label: state.name,
        value: state.state_code,
      }));
        setStateList(formatted);
    })
  }, [])

 useEffect(() => {
  if (state) {
    const selectedState = stateList.find(item => item.value === state);
    if (selectedState) {
      setCity(null);
      getCities(selectedState.label);
    }
  } else {
    setCityList([]);
  }
 }, [state, stateList])

  useFocusEffect(
    useCallback(() => {

      setUsername('');
      setPassword('');
      setPasswordCheck('');
      setCpf('');
      setCpfMasked('');
      setUserName('');
      setOpenState(false);
      setOpenCity(false);
      setState(null);
      setCity(null);
      setCityList([]);
      setNameTouched(false);
      setCpfTouched(false);
      setUserNameTouched(false);
      setPasswordTouched(false);
      setPasswordCheckTouched(false);
      setStateTouched(false);
      setCityTouched(false);
    }, [])
  );

  async function getCities(value: string) {
    const citiesList = await getCitiesFromState(value)
    const formatted = citiesList.map(city => ({
      label: city,
      value: city
    }));
    setCityList(formatted);
  }

  const validateField = (field: string, value: string, touched: boolean, ...args: any[]): ValidationResult => {
    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumbers = /\d/.test(value);
    const nameRegex = /^[a-zA-ZÀ-ÿ\s]+$/;
    const cpfClean = value.replace(/\D/g, '');
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    const password = args[0];
    let sum;

    if (!touched) {
      return { isValid: true, message: '' };
    }

    switch (field) {
      case 'name':
        if (!value.trim()) return { isValid: false, message: 'Nome é obrigatório' };
        if (value.trim().length < 2) return { isValid: false, message: 'Nome deve ter pelo menos 2 caracteres' };
        if (value.trim().length > 100) return { isValid: false, message: 'Nome deve ter no máximo 100 caracteres' };
        if (!nameRegex.test(value.trim())) return { isValid: false, message: 'Nome deve conter apenas letras' };
        return { isValid: true, message: '' };

      case 'cpf':
        if (!value.trim()) {
          return { isValid: false, message: 'CPF é obrigatório' };
        }
        if (cpfClean.length !== 11) {
          return { isValid: false, message: 'CPF deve ter 11 dígitos' };
        }
        if (/^(\d)\1+$/.test(cpfClean)) {
          return { isValid: false, message: 'CPF inválido' };
        }
        sum = 0;
        for (let i = 0; i < 9; i++) {
          sum += parseInt(cpfClean.charAt(i)) * (10 - i);
        }
        let remainder = (sum * 10) % 11;
        if (remainder === 10) remainder = 0;
        if (remainder !== parseInt(cpfClean.charAt(9))) {
          return { isValid: false, message: 'CPF inválido' };
        }
        sum = 0;
        for (let i = 0; i < 10; i++) {
          sum += parseInt(cpfClean.charAt(i)) * (11 - i);
        }
        remainder = (sum * 10) % 11;
        if (remainder === 10) remainder = 0;
        if (remainder !== parseInt(cpfClean.charAt(10))) {
          return { isValid: false, message: 'CPF inválido' };
        }
        return { isValid: true, message: '' };

      case 'username':
        if (!value.trim()) {
          return { isValid: false, message: 'Nome de usuário é obrigatório' };
        }
        if (value.trim().length < 3) {
          return { isValid: false, message: 'Nome de usuário deve ter pelo menos 3 caracteres' };
        }
        if (value.trim().length > 30) {
          return { isValid: false, message: 'Nome de usuário deve ter no máximo 30 caracteres' };
        }
        if (!usernameRegex.test(value.trim())) {
          return { isValid: false, message: 'Nome de usuário deve conter apenas letras, números e _' };
        }
        return { isValid: true, message: '' };

      case 'password':
        if (!value) {
          return { isValid: false, message: 'Senha é obrigatória' };
        }
        if (value.length < 8) {
          return { isValid: false, message: 'Senha deve ter pelo menos 8 caracteres' };
        }
        if (value.length > 50) {
          return { isValid: false, message: 'Senha deve ter no máximo 50 caracteres' };
        }
        if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
          return { isValid: false, message: 'Senha deve conter maiúscula, minúscula e número' };
        }
        return { isValid: true, message: '' };

      case 'passwordCheck':
        if (!value) {
          return { isValid: false, message: 'Confirmação de senha é obrigatória' };
        }
        if (password !== value) {
          return { isValid: false, message: 'As senhas não coincidem' };
        }
        return { isValid: true, message: '' };

      case 'state':
        if (!value.trim()) {
          return { isValid: false, message: 'Estado é obrigatório' };
        }
        return { isValid: true, message: '' };

      case 'city':
        if (!value.trim()) {
          return { isValid: false, message: 'Cidade é obrigatória' };
        }
        return { isValid: true, message: '' };

      default:
        return { isValid: true, message: '' };
    }
  };

  const nameError = useMemo(() => validateField('name', user, nameTouched), [user, nameTouched]);
  const cpfError = useMemo(() => validateField('cpf', cpf, cpfTouched), [cpf, cpfTouched]);
  const usernameError = useMemo(() => validateField('username', userName, userNameTouched), [userName, userNameTouched]);
  const passwordError = useMemo(() => validateField('password', password, passwordTouched), [password, passwordTouched]);
  const passwordCheckError = useMemo(() => validateField('passwordCheck', passwordCheck, passwordCheckTouched, password), [passwordCheck, passwordCheckTouched, password]);
  const stateError = useMemo(() => validateField('state', state || '', stateTouched), [state, stateTouched]);
  const cityError = useMemo(() => validateField('city', city || '', cityTouched), [city, cityTouched]);

  const formValid = useMemo(() => nameError.isValid && cpfError.isValid && usernameError.isValid && passwordError.isValid && passwordCheckError.isValid && stateError.isValid && cityError.isValid, [nameError, cpfError, usernameError, passwordError, passwordCheckError, stateError, cityError]);

  const isFormValid = formValid;

  const markAllFieldsAsTouched = () => {
    setNameTouched(true);
    setCpfTouched(true);
    setUserNameTouched(true);
    setPasswordTouched(true);
    setPasswordCheckTouched(true);
    setStateTouched(true);
    setCityTouched(true);
  };

  const handleRegisterPress = async () => {
    if (!isFormValid) {
      markAllFieldsAsTouched();
      return;
    }

     const response = await registerUser({ "name": user, "username": userName, "password": password, "cpf": cpf, "state": state, "city": city })

    if (response.success){
      try {
        router.push('/');
      } catch (err) {
        console.log('Erro em redirecionar a página:', err);
      }
    }
    else {
      const firstKey = Object.keys(response.data)[0];
      const firstMessage = response.data[firstKey][0];
      setActualError(firstMessage)
    }
  };

 return (
    <Pressable onPress={() => Keyboard.dismiss()} style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={{flexDirection: 'row'}}>
            <Text style={[styles.titleLogo, styles.title]}>
              pet
            </Text>
            <Text style={[styles.titleLogoMini, styles.title]}>
              isko
            </Text>
          </View>
          <Image style={styles.logoImage} resizeMode='contain' source={require('../../assets/logo/logo.png')} />
        </View>
        
        <KeyboardAvoidingView style={styles.content} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <Text style={[styles.titleList]}>
              cadastro
            </Text>

            <View style={styles.fieldsContainer}>

              <CustomInput
                onChangeText={(dado: SetStateAction<string>) => setUsername(dado)}
                onFocus={() => setNameTouched(true)}
                placeholder='Digite seu nome'
                errorMessage={!nameError.isValid ? nameError.message : ''}
                iconName='account'
                value={user}
              />

              <MaskedInput
                mask={[/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/]}
                value={cpfMasked}
                onChangeText={(masked, unmasked) => {
                  setCpfMasked(masked);
                  setCpf(unmasked);
                }}
                onFocus={() => setCpfTouched(true)}
                placeholder="Digite seu CPF"
                errorMessage={!cpfError.isValid ? cpfError.message : ''}
                iconName='card-account-details-outline'
                keyboardType="numeric"
              />

              <CustomInput
                onChangeText={(dado: SetStateAction<string>) => setUserName(dado)}
                onFocus={() => setUserNameTouched(true)}
                placeholder='Digite o usuário'
                errorMessage={!usernameError.isValid ? usernameError.message : ''}
                iconName='at'
                value={userName}
              />

              <CustomInput
                onChangeText={(dado: SetStateAction<string>) => setPassword(dado)}
                onFocus={() => setPasswordTouched(true)}
                isPassword={true}
                placeholder='Digite a senha'
                errorMessage={!passwordError.isValid ? passwordError.message : ''}
                iconName='lock'
                value={password}
              />

              <CustomInput
                onChangeText={(dado: SetStateAction<string>) => setPasswordCheck(dado)}
                onFocus={() => setPasswordCheckTouched(true)}
                isPassword={true} 
                placeholder='Repita sua senha'
                errorMessage={!passwordCheckError.isValid ? passwordCheckError.message : ''}
                iconName='lock-check'
                value={passwordCheck}
              />

              <View style={styles.dropdownWrapperOne}>
              <DropDownPicker
                  textStyle={styles.pickerInput}
                  open={openState}
                  value={state}
                  items={stateList}
                  setOpen={setOpenState}
                  setValue={setState}
                  style={[styles.input]}
                  listMode="MODAL"
                  modalContentContainerStyle={{ backgroundColor: Colors.creme }}
                  dropDownContainerStyle={{ backgroundColor: Colors.creme }}
                  onOpen={() => setStateTouched(true)}
                  placeholder={'Selecione seu estado'}
                />
                { !stateError.isValid && (
                  <Text style={styles.dropdownErrorText}>{stateError.message}</Text>
                )}
              </View>

              <View style={styles.dropdownWrapperTwo}>
                <DropDownPicker
                  textStyle={styles.pickerInput}
                  open={openCity}
                  value={city}
                  items={cityList}
                  setOpen={setOpenCity}
                  setValue={setCity}
                  listMode="MODAL"
                  modalContentContainerStyle={{ backgroundColor: Colors.creme }}
                  dropDownContainerStyle={{ backgroundColor: Colors.creme }}
                  disabled={!state}
                  onOpen={() => setCityTouched(true)}
                  style={[styles.input]}
                  placeholder={'Selecione sua cidade'}
                />
                { !cityError.isValid && state && (
                  <Text style={styles.dropdownErrorText}>{cityError.message}</Text>
                )}
              </View>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[
                  styles.registerButton,
                  !isFormValid && styles.registerButtonDisabled
                ]}
                onPress={handleRegisterPress}
                disabled={false}
              >
                <Text style={[
                  styles.registerButtonText,
                  !isFormValid && styles.registerButtonTextDisabled
                ]}>
                  Cadastrar
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </Pressable>
 );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    padding: 20,
    backgroundColor: Colors.creme
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
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
  logoImage: {
    height: 60,
    width: 50
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  titleList: {
    fontFamily: 'PoppinsExtraLight',
    fontSize: 60,
    color: Colors.laranja,
    textAlign: 'center',
    marginBottom: 10,
  },
  fieldsContainer: {
    gap: 5,
    backgroundColor: Colors.creme
  },
    input: {
    borderWidth: 2,
    borderRadius: 10,
    borderColor: Colors.amarelo,
    paddingLeft: 20,
    height: 50,
      backgroundColor: 'transparent',
    paddingRight: 10
  },
  pickerInput: {
    fontFamily: 'PoppinsRegular',
    fontSize: 17,
    color: Colors.amarelo
  },
  dropdownWrapperOne: {
    marginTop: 5,
    marginBottom: 10,
    zIndex: 2000,
  },
  dropdownWrapperTwo: {
    marginTop: 15,
    marginBottom: 10,
    zIndex: 1000,
  },
  dropdownErrorText: {
    color: 'red',
    fontSize: 11,
    marginTop: 5,
    marginLeft: 7,
    fontFamily: 'PoppinsRegular'
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    backgroundColor: Colors.creme
  },
  registerButton: {
    backgroundColor: Colors.laranja,
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 100,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    minWidth: 200,
    alignItems: 'center'
  },
  registerButtonDisabled: {
    backgroundColor: '#cccccc',
    shadowOpacity: 0.1,
    elevation: 2,
  },
  registerButtonText: {
    textAlign: 'center',
    fontFamily: 'PoppinsMedium',
    fontSize: 22,
    color: Colors.creme
  },
  registerButtonTextDisabled: {
    color: '#888888'
  }
})