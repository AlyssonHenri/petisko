import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { CustomInputProps } from '@/interfaces/customInput';
import { Icon } from 'react-native-paper';

const CustomInput: React.FC<CustomInputProps> = ({
  iconName,
  placeholder,
  errorMessage,
  isPassword = false,
  isPasswd = false,
  style,
  ...rest
}) => {
  const [secureText, setSecureText] = useState(isPassword);

  const toggleSecureEntry = () => {
    setSecureText(prev => !prev);
  };

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.inputContainer,
          errorMessage ? styles.errorBorder : null, 
        ]}>

        {iconName ? (
          <View style={styles.icon}>
            <Icon
              source={iconName}
              size={24} 
              color={errorMessage ? '#FF0000' : '#555'} 
            />
          </View>
        ) : null}

        <TextInput
          style={[styles.input, style]}
          placeholder={placeholder}
          placeholderTextColor="#A9A9A9"
          secureTextEntry={secureText}
          {...rest}
        />

        {isPassword && (
          <TouchableOpacity onPress={toggleSecureEntry} style={styles.eyeIcon}>
            <Icon
              source={secureText ? 'eye-off' : 'eye'}
              size={20}
              color="#888"
            />
          </TouchableOpacity>
        )}
      </View>

      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    borderRadius: 16,
    backgroundColor: 'white',
    minHeight: 56,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
      },
      android: {
        elevation: 5,
        shadowColor: '#000',
      },
    }),
  },
  errorBorder: {
    borderWidth: 1,
    borderColor: '#FF0000',
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    paddingVertical: 10,
  },
  eyeIcon: {
    paddingLeft: 10,
    paddingVertical: 10,
  },
  errorText: {
    color: '#FF0000',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 5,
  },
});

export default CustomInput;