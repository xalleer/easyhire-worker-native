import colors from '@/theme/colors';
import { Feather } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Platform, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

interface InputUiProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  type?: 'text' | 'password' | 'email' | 'tel';
  style?: object;
  editable?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
}

const InputUi: React.FC<InputUiProps> = ({
  value,
  onChangeText,
  placeholder = '',
  type = 'text',
  style,
  editable = true,
  onFocus,
  onBlur,
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(prev => !prev);
  };

  const handleFocus = () => {
    setIsFocused(true);
    onFocus?.();
  };

  const handleBlur = () => {
    setIsFocused(false);
    onBlur?.();
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
        autoCapitalize={type === 'email' ? 'none' : 'sentences'}
        keyboardType={type === 'email' ? 'email-address' : type === 'tel' ? 'phone-pad' : 'default'}
        onFocus={handleFocus}
        onBlur={handleBlur}
        editable={editable}
      />
      {type === 'password' && (
        <TouchableOpacity
          style={styles.iconContainer}
          onPress={togglePasswordVisibility}
          disabled={!editable}
        >
          <Feather
            name={isPasswordVisible ? 'eye' : 'eye-off'}
            size={18}
            color={editable ? '#666' : '#999'}
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
    backgroundColor: colors.white,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    borderWidth: 1,
    borderColor: colors.borderColor,
  },
  focusedContainer: {
    borderColor: colors.lightGreen,
    borderWidth: 1,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.black,
    paddingVertical: 6,
  },
  iconContainer: {
    padding: 8,
  },
});

export default InputUi;