import { Image, Keyboard, StyleSheet, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { Text, View } from '@/components/Themed';
import Colors from '@/constants/Colors';
import RegisterInput from '@/components/custom-register-input';
import { useEffect, useState } from 'react';
import { IState } from '@/interfaces/country';
import getStates, { getCitiesFromState } from '@/controllers/states-controller';
import DropDownPicker from 'react-native-dropdown-picker';




export default function RegisterScreen() {
  const [user, setUsername] = useState('')
  const [password, setPassword] = useState('');
  const [openState, setOpenState] = useState(false);
  const [openCity, setOpenCity] = useState(false);
  const [state, setState] = useState(null);
  const [city, setCity] = useState(null);
  const [stateList, setStateList] = useState<{ label: string; value: string }[]>([]);
  const [cityList, setCityList] = useState<{ label: string; value: string }[]>([]);
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
              <DropDownPicker
                textStyle={styles.pickerInput}
                    open={openState}
                    value={state}
                    items={stateList}
                    setOpen={setOpenState}
                    setValue={setState}
                    setItems={setStateList}
                    style={[{marginBottom: 25}, styles.input]}
                    listMode="MODAL"
                    onOpen={() => setStateTouched(true)} 
                    placeholder={'Selecione seu estado'}
                    onChangeValue={(value) => {
                    if (value) {
                      const selectedState = stateList.find(item => item.value === value);
                      const stateName = selectedState!.label;
                      setCity(null);
                      setOpenState(false)
                      getCities(stateName);
                    }
                  }}
                />
                {state == null && stateTouched && (
                    <Text style={{color: 'red'}}>É necessário selecionar um estado</Text>
                )}                

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
                  <View>
                    <Text style={{color: 'red'}}>É necessário selecionar uma cidade</Text>
                  </View>
                ) }                


          </View>

          <TouchableOpacity style={{backgroundColor: Colors.laranja, padding: 10, borderRadius: 100,     boxShadow: '0px 2px 5px 0px rgba(0, 0, 0, 0.5)', marginHorizontal: 90, marginTop: 50, 
  }}>
              <Text style={{textAlign: 'center', fontFamily: 'PoppinsMedium', fontSize: 25, color: Colors.creme}}>Cadastrar</Text>
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
    inputContainer: {
      borderBottomWidth: 0,
    }

});
