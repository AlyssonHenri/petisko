import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Icon } from 'react-native-paper';
import Colors from '@/constants/Colors';

interface ButtonProps {
  title: string;
  onPress?: () => void;
}

export const AddButton: React.FC<ButtonProps> = ({ title, onPress }) => {
  return (
    <View>
        <TouchableOpacity onPress={onPress} style={styles.addBtn}>
            <Icon source='plus-circle' size={24} color={Colors.laranja} />
            <Text style={styles.addText}>{title}</Text>
        </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
    addBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        padding: 12,
        borderRadius: 12,
        marginTop: 5,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: Colors.laranja,
        borderStyle: 'dashed',
    },
    addText: {
        color: Colors.laranja,
        marginLeft: 8,
        fontFamily: 'NunitoBold',
        fontSize: 16,
    },
});