import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-paper';
import Colors from '@/constants/Colors';

interface PopupModalProps {
  visible: boolean;
  title: string;
  message: string;
  onClose: () => void;
  onConfirm?: () => void;
  type: 'success' | 'error' | 'conf';
}

const PopupModal: React.FC<PopupModalProps> = ({ visible, title, message, onClose, onConfirm, type }) => {
  const isSuccess = type === 'success';
  const iconName = isSuccess ? 'check-circle-outline' : 'alert-circle-outline';
  const iconColor = isSuccess ? Colors.verde : Colors.vermelho;
  const buttonColor = isSuccess ? Colors.verde : Colors.laranja;

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Icon source={iconName} size={50} color={iconColor} />
          <Text style={styles.modalTitle}>{title}</Text>
          <Text style={styles.modalText}>{message}</Text>

          {type !== 'conf' &&
            <TouchableOpacity
              style={[styles.button, { backgroundColor: buttonColor }]}
              onPress={onClose}
            ><Text style={styles.textStyle}>Fechar</Text></TouchableOpacity>}
          {type === 'conf' && onConfirm &&

            <View style={{ flexDirection: 'row', gap: 20, alignItems: 'flex-start' }}>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: buttonColor }]}
                onPress={onConfirm}
              ><Text style={styles.textStyle}>Sim</Text></TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, { backgroundColor: buttonColor }]}
                onPress={onClose}
              ><Text style={styles.textStyle}>Não</Text></TouchableOpacity>
            </View>
          }


        </View>
      </View>
    </Modal >
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'NunitoBold',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 16,
    fontFamily: 'NunitoMedium',
  },
  button: {
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    elevation: 2,
  },
  textStyle: {
    color: 'white',
    fontFamily: 'NunitoBold',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default PopupModal;
