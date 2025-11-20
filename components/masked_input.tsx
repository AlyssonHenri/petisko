import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { CustomInputProps } from '@/interfaces/customInput';
import { Icon } from 'react-native-paper';
import MaskInput from 'react-native-mask-input';

interface MaskedInputProps extends Omit<CustomInputProps, 'onChangeText' | 'value'> {
  mask: (string | RegExp)[];
  value: string;
  onChangeText: (masked: string, unmasked: string) => void;
}

const MaskedInput: React.FC<MaskedInputProps> = ({
  mask,
  value,
  onChangeText,
  placeholder,
  errorMessage,
  iconName,
  style,
  ...rest
}) => {
  return (
    <View style={styles.container}>
      <View
        style={[
          styles.inputContainer,
          errorMessage ? styles.errorBorder : styles.defaultBorder,
        ]}>
        {iconName ? (
          <View style={styles.icon}>
            <Icon
              source={iconName}
              size={20}
              color={errorMessage ? '#FF0000' : '#888'}
            />
          </View>
        ) : null}
        <MaskInput
          style={[styles.input, style]}
          value={value}
          onChangeText={onChangeText}
          mask={mask}
          placeholder={placeholder}
          placeholderTextColor="#A9A9A9"
          {...rest}
        />
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
    borderRadius: 8,
    backgroundColor: 'white',
    minHeight: 50,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  defaultBorder: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
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
    paddingVertical: 10,
    fontFamily: 'PoppinsRegular',
  },
  errorText: {
    color: '#FF0000',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 5,
  },
});

export default MaskedInput;