import React from 'react';
import { View, Text, Pressable, StyleSheet, LayoutAnimation, Platform, UIManager } from 'react-native';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface SelectSwitchProps {
  field_1: string;
  field_2: string;
  selected: string;
  onSelect: (option: string) => void;
}

export const SelectSwitch: React.FC<SelectSwitchProps> = ({ field_1, field_2, selected, onSelect }) => {
    const handlePress = ( option: string ) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
        onSelect(option)
    }

    const select1 = selected === field_1
    const select2 = selected === field_2

    return (
        <View style={styles.container}>
            <Pressable
                style={[
                    styles.button,
                    select1 && styles.activeButton
                ]}
                onPress={() => handlePress(field_1)}
            >
                <Text style={[styles.text, select1 ? styles.activeText : styles.inactiveText]}>
                    {field_1}
                </Text>
            </Pressable>

            <Pressable
                style={[
                    styles.button,
                    select2 && styles.activeButton
                ]}
                onPress={() => handlePress(field_2)}
            >
                <Text style={[styles.text, select2 ? styles.activeText : styles.inactiveText]}>
                    {field_2}
                </Text>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#ffffffff',
    borderRadius: 30, 
    padding: 4,
    height: 50,
    width: '100%',
    maxWidth: 300,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  button: {
    flex: 1, 
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  activeButton: {
    backgroundColor: '#E4A985',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,
    elevation: 2,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
  activeText: {
    color: '#FFFFFF', 
  },
  inactiveText: {
    color: '#555555',
  },
});