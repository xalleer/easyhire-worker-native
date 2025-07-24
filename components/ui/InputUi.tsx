import colors from '@/theme/colors';
import { Feather } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Platform, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

interface InputUiProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  type?: 'text' | 'password' | 'email';
  style?: object;
}

const InputUi: React.FC<InputUiProps> = ({
  value,
  onChangeText,
  placeholder = '',
  type = 'text',
  style,
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <View style={[styles.container, isFocused && styles.focusedContainer, style]}>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#999"
        secureTextEntry={type === 'password' && !isPasswordVisible}
        autoCapitalize="none"
        keyboardType={type === 'email' ? 'email-address' : 'default'}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      {type === 'password' && (
        <TouchableOpacity
          style={styles.iconContainer}
          onPress={togglePasswordVisibility}
        >
          <Feather
            name={isPasswordVisible ? 'eye' : 'eye-off'}
            size={18}
            color="#666"
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 15,
    borderWidth: 1,
    height: 56,
    borderColor: '#E0E0E0',
  },
  focusedContainer: {
    borderColor: '#4CAF50', // Green border on focus
    borderWidth: 1,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: Platform.OS === 'ios' ? 4 : 0,
  },
  iconContainer: {
    padding: 4,
  },
});

export default InputUi;