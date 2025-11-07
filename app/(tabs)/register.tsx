import { Image, Keyboard, StyleSheet, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { Text, View } from '@/components/Themed';
import Colors from '@/constants/Colors';
import RegisterInput from '@/components/custom-register-input';
import { useEffect, useState } from 'react';
import getStates, { getCitiesFromState } from '@/controllers/states-controller';
import DropDownPicker from 'react-native-dropdown-picker';
import registerUser from '@/services/register';

export default function RegisterScreen() {
  const [user, setUsername] = useState('')
  const [password, setPassword] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');
  const [cpf, setCpf] = useState('');
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

  const isFormValid = () => {
    return user.trim() !== '' && 
           cpf.trim() !== '' && 
           userName.trim() !== '' && 
           password.trim() !== '' &&
           passwordCheck.trim() !== '' && 
           state.trim() !== '' && 
           city.trim() !== '';
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
                onFocus={() => setNameTouched(true)}
                placeholder='Digite seu nome' 
                errorMessage='O campo deve estar preenchido.' 
                showError={nameTouched && user.trim() === ''}
              />
              <RegisterInput 
                outputFunc={(dado) => setCpf(dado)} 
                onFocus={() => setCpfTouched(true)}
                placeholder='Digite seu CPF' 
                errorMessage='O campo deve estar preenchido.' 
                showError={cpfTouched && cpf.trim() === ''}
              />
              <RegisterInput 
                outputFunc={(dado) => setUserName(dado)} 
                onFocus={() => setUserNameTouched(true)}
                placeholder='Digite o usuário' 
                errorMessage='O campo deve estar preenchido.' 
                showError={userNameTouched && userName.trim() === ''}
              />
              <RegisterInput 
                outputFunc={(dado) => setPassword(dado)} 
                onFocus={() => setPasswordTouched(true)}
                isPasswd={true} 
                placeholder='Digite a senha' 
                errorMessage='O campo deve estar preenchido.' 
                showError={passwordTouched && password.trim() === '' || password !== passwordCheck && passwordCheck.trim() !== ''}
              />
              <RegisterInput 
                outputFunc={(dado) => setPasswordCheck(dado)} 
                onFocus={() => setPasswordCheckTouched(true)}
                isPasswd={true} 
                placeholder='Repita sua senha' 
                errorMessage='O campo deve estar preenchido.' 
                showError={passwordCheckTouched && passwordCheck.trim() === '' || password !== passwordCheck && passwordCheck.trim() !== ''}
              />
              
              <View style={styles.dropdownWrapper}>
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
                {state == null && stateTouched && (
                  <Text style={styles.dropdownErrorText}>É necessário selecionar um estado</Text>
                )}
              </View>

              <View style={styles.dropdownWrapper}>
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
                {city == null && cityTouched && state != null && (
                  <Text style={styles.dropdownErrorText}>É necessário selecionar uma cidade</Text>
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
    paddingTop: 20,
    fontSize: 60,
    color: Colors.laranja
  },
  content: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  fieldsContainer: {
    paddingTop: 10,
    gap: 0,
    flex: 1,
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
  dropdownMargin: {
    marginBottom: 25
  },
  inputContainer: {
    borderBottomWidth: 0,
  },
  dropdownWrapper: {
    marginBottom: 15,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 5,
    marginBottom: 10,
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
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center'
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
