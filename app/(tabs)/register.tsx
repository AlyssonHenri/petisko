import { Image, Keyboard, StyleSheet, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { Text, View } from '@/components/Themed';
import Colors from '@/constants/Colors';
import RegisterInput from '@/components/custom-register-input';
import { useEffect, useState } from 'react';
import getStates, { getCitiesFromState } from '@/controllers/states-controller';
import DropDownPicker from 'react-native-dropdown-picker';
import registerUser from '@/services/register';
import MaskInput from 'react-native-mask-input';

interface ValidationResult {
  isValid: boolean;
  message: string;
}

export default function RegisterScreen() {
  const [user, setUsername] = useState('')
  const [password, setPassword] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');
  const [cpf, setCpf] = useState('');
  const [cpfMasked, setCpfMasked] = useState('');
  const [userName, setUserName] = useState('');
  const [openState, setOpenState] = useState(false);
  const [openCity, setOpenCity] = useState(false);
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [stateList, setStateList] = useState<{ label: string; value: string }[]>([]);
  const [cityList, setCityList] = useState<{ label: string; value: string }[]>([]);
  const [nameTouched, setNameTouched] = useState(false);
  const [cpfTouched, setCpfTouched] = useState(false);
  const [userNameTouched, setUserNameTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [passwordCheckTouched, setPasswordCheckTouched] = useState(false);
  const [stateTouched, setStateTouched] = useState(false);
  const [cityTouched, setCityTouched] = useState(false);


  useEffect(()=> {
    getStates().then(statesApi => {
    const formatted = statesApi.map(state => ({
      label: state.name,
      value: state.state_code,
    }));
    setStateList(formatted);
    })
      }, [])
  

  async function getCities(value: string) {
    const citiesList = await getCitiesFromState(value)
    const formatted = citiesList.map(city => ({
      label: city,
      value: city
    }));
    setCityList(formatted);
  }

  const validateName = (name: string): ValidationResult => {
    if(!nameTouched) {
      return { isValid: true, message: '' };
    }

    if (!name.trim()) {
      return { isValid: false, message: 'Nome é obrigatório' };
    }
    if (name.trim().length < 2) {
      return { isValid: false, message: 'Nome deve ter pelo menos 2 caracteres' };
    }
    if (name.trim().length > 100) {
      return { isValid: false, message: 'Nome deve ter no máximo 100 caracteres' };
    }

    const nameRegex = /^[a-zA-ZÀ-ÿ\s]+$/;
    if (!nameRegex.test(name.trim())) {
      return { isValid: false, message: 'Nome deve conter apenas letras' };
    }
    return { isValid: true, message: '' };
  };

  const validateCPF = (cpf: string): ValidationResult => {
    const cpfClean = cpf.replace(/\D/g, '');
    let sum;

    if(!cpfTouched) {
      return { isValid: true, message: '' };
    }

    if (!cpf.trim()) {
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
  };

  const validateUsername = (username: string): ValidationResult => {
    if(!userNameTouched) {
      return { isValid: true, message: '' };
    }

    if (!username.trim()) {
      return { isValid: false, message: 'Nome de usuário é obrigatório' };
    }
    if (username.trim().length < 3) {
      return { isValid: false, message: 'Nome de usuário deve ter pelo menos 3 caracteres' };
    }
    if (username.trim().length > 30) {
      return { isValid: false, message: 'Nome de usuário deve ter no máximo 30 caracteres' };
    }

    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(username.trim())) {
      return { isValid: false, message: 'Nome de usuário deve conter apenas letras, números e _' };
    }
    return { isValid: true, message: '' };
  };

  const validatePassword = (password: string): ValidationResult => {
    if(!passwordTouched) {
      return { isValid: true, message: '' };
    }

    if (!password) {
      return { isValid: false, message: 'Senha é obrigatória' };
    }
    if (password.length < 8) {
      return { isValid: false, message: 'Senha deve ter pelo menos 8 caracteres' };
    }
    if (password.length > 50) {
      return { isValid: false, message: 'Senha deve ter no máximo 50 caracteres' };
    }

    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);

    if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
      return { isValid: false, message: 'Senha deve conter maiúscula, minúscula e número' };
    }
    return { isValid: true, message: '' };
  };

  const validatePasswordConfirmation = (password: string, passwordCheck: string): ValidationResult => {
    if(!passwordCheckTouched) {
      return { isValid: true, message: '' };
    }

    if (!passwordCheck) {
      return { isValid: false, message: 'Confirmação de senha é obrigatória' };
    }
    if (password !== passwordCheck) {
      return { isValid: false, message: 'As senhas não coincidem' };
    }
    return { isValid: true, message: '' };
  };

  const validateState = (state: string): ValidationResult => {
    if(!validateState) {
      return { isValid: true, message: '' };
    }

    if (!state.trim()) {
      return { isValid: false, message: 'Estado é obrigatório' };
    }
    return { isValid: true, message: '' };
  };

  const validateCity = (city: string): ValidationResult => {
    if(!cityTouched) {
      return { isValid: true, message: '' };
    }

    if (!city.trim()) {
      return { isValid: false, message: 'Cidade é obrigatória' };
    }
    return { isValid: true, message: '' };
  };

  const isFormValid = () => {
    return validateName(user).isValid && 
           validateCPF(cpf).isValid && 
           validateUsername(userName).isValid && 
           validatePassword(password).isValid &&
           validatePasswordConfirmation(password, passwordCheck).isValid && 
           validateState(state).isValid && 
           validateCity(city).isValid;
  };

  const markAllFieldsAsTouched = () => {
    setNameTouched(true);
    setCpfTouched(true);
    setUserNameTouched(true);
    setPasswordTouched(true);
    setStateTouched(true);
    setCityTouched(true);
  };

  const handleRegisterPress = () => {
    if (!isFormValid()) {
      markAllFieldsAsTouched();
      return;
    }
    registerUser({"name": user, "username": userName, "password": password, "cpf": cpf, "state": state, "city": city})
    console.log('Cadastro realizado com sucesso!');
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={styles.header}>
            <Text style={[styles.titleLogo, styles.title]}>
                pet<Text style={[styles.titleLogoMini, styles.title]}>isko</Text>
            </Text>
            <Image style={styles.logoImage} resizeMode='contain' source={require('../../assets/logo/logo.png')} />
        </View>
        
        <View style={styles.content}>
            <Text style={[styles.titleList]}>
                cadastro
            </Text>

            <View style={styles.fieldsContainer}>
              <RegisterInput 
                outputFunc={(dado) => setUsername(dado)} 
                onFocus={() => {setNameTouched(true), console.log('oi')}}
                placeholder='Digite seu nome' 
                errorMessage={validateName(user).message} 
                showError={nameTouched && !validateName(user).isValid}
              />
              <View>
                <MaskInput
                  style={[styles.input, styles.maskInput]}
                  value={cpfMasked}
                  onChangeText={(masked) => {
                    setCpfMasked(masked);
                    setCpf(masked.replace(/\D/g, '')); 
                  }}
                  onFocus={() => setCpfTouched(true)}
                  mask={[/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/]}
                  placeholder="Digite seu CPF"
                  placeholderTextColor={Colors.amarelo}
                  keyboardType="numeric"
                />
                <Text style={styles.errorText}>{validateCPF(cpf).message}</Text>
              </View>
              <RegisterInput 
                outputFunc={(dado) => setUserName(dado)} 
                onFocus={() => setUserNameTouched(true)}
                placeholder='Digite o usuário' 
                errorMessage={validateUsername(userName).message} 
                showError={userNameTouched && !validateUsername(userName).isValid}
              />
              <RegisterInput 
                outputFunc={(dado) => setPassword(dado)} 
                onFocus={() => setPasswordTouched(true)}
                isPasswd={true} 
                placeholder='Digite a senha' 
                errorMessage={validatePassword(password).message} 
                showError={passwordTouched && !validatePassword(password).isValid}
              />
              <RegisterInput 
                outputFunc={(dado) => setPasswordCheck(dado)} 
                onFocus={() => setPasswordCheckTouched(true)}
                isPasswd={true} 
                placeholder='Repita sua senha' 
                errorMessage={validatePasswordConfirmation(password, passwordCheck).message} 
                showError={passwordCheckTouched && !validatePasswordConfirmation(password, passwordCheck).isValid}
              />
              
              <View style={styles.dropdownWrapperOne}>
                <DropDownPicker
                  textStyle={styles.pickerInput}
                  open={openState}
                  value={state}
                  items={stateList}
                  setOpen={setOpenState}
                  setValue={setState}
                  setItems={setStateList}
                  style={[styles.input]}
                  listMode="MODAL"
                  onOpen={() => setStateTouched(true)} 
                  placeholder={'Selecione seu estado'}
                  onChangeValue={(value) => {
                    if (value) {
                      const selectedState = stateList.find(item => item.value === value);
                      const stateName = selectedState!.label;
                      setCity('');
                      setOpenState(false)
                      getCities(stateName);
                    }
                  }}
                />
                {stateTouched && !validateState(state).isValid && (
                  <Text style={styles.dropdownErrorText}>{validateState(state).message}</Text>
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
                  setItems={setCityList}
                  listMode="MODAL"
                  disabled={!state} 
                  onOpen={() => setCityTouched(true)} 
                  style={[styles.input]}
                  placeholder={'Selecione sua cidade'}
                />
                {cityTouched && !validateCity(city).isValid && state && (
                  <Text style={styles.dropdownErrorText}>{validateCity(city).message}</Text>
                )}
              </View>                
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={[
                  styles.registerButton, 
                  !isFormValid() && styles.registerButtonDisabled
                ]}
                onPress={handleRegisterPress}
                disabled={false}
              >
                <Text style={[
                  styles.registerButtonText,
                  !isFormValid() && styles.registerButtonTextDisabled
                ]}>
                  Cadastrar
                </Text>
              </TouchableOpacity>
            </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    marginTop: 0,
    alignItems: 'center',
  },
  logoImage: {
    height: 60, 
    width: 50
  },
  titleLogo: {
    fontFamily: 'PoppinsBold'
  },
  titleLogoMini: {
    fontFamily: 'PoppinsSemiBold'
  },
  titleList: {
    fontFamily: 'PoppinsExtraLight',
    fontSize: 60,
    color: Colors.laranja
  },
  content: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column'
  },
  fieldsContainer: {
    paddingTop: 0,
    gap: 0,
  },
  pickerInput: {
    fontFamily: 'PoppinsRegular',
    fontSize: 17,
    color: Colors.amarelo
  },
  input: {
    borderWidth: 2,
    borderRadius: 10,
    borderColor: Colors.amarelo,
    paddingLeft: 20,
    height: 50,
  },
  maskInput: {
    fontFamily: 'PoppinsRegular',
    backgroundColor: 'white',
    borderWidth: 2,
    borderRadius: 10,
    borderColor: Colors.amarelo,
    paddingLeft: 20,
    height: 50,
    color: Colors.amarelo,
    fontSize: 18
  },
  dropdownMargin: {
    marginBottom: 25
  },
  inputContainer: {
    borderBottomWidth: 0,
  },
  dropdownWrapperOne: {
    marginTop: 5,
    marginBottom: 10,

  },
  dropdownWrapperTwo: {
    marginTop: 15,

  },
  errorText: {
    color: 'red',
    fontSize: 11,
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 5,
    fontFamily: 'PoppinsRegular'
  },
  dropdownErrorText: {
    color: 'red',
    fontSize: 11,
    marginTop: 5,
    marginBottom: -10,
    marginLeft: 7,
    fontFamily: 'PoppinsRegular'
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20
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
});
