import { TextInputProps } from 'react-native';

export interface CustomInputProps extends TextInputProps {
  iconName?: string;
  placeholder: string;
  errorMessage?: string;
  isPassword?: boolean;
  outputFunc?: (text: string) => void;
  showError?: boolean;
  isPasswd?: boolean; 
  value?: string; 
}