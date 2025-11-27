import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Icon } from 'react-native-paper';
import Colors from '@/constants/Colors';
import { useRouter } from 'expo-router';

interface HeaderProps {
  title: string;
  onBackPress?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ title, onBackPress }) => {
  const router = useRouter();

  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={handleBack} style={styles.backButton}>
        <Icon source="arrow-left" size={28} color={Colors.laranja} />
      </TouchableOpacity>

      <Text style={styles.headerTitle}>
        {title}
      </Text>

      <View style={{ width: 44 }} />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 50 : 40,
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'white',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'NunitoBold',
    color: Colors.preto,
    fontWeight: 'bold',
  },
});