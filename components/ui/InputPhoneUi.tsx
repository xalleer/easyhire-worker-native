import colors from '@/theme/colors';
import React, { forwardRef } from 'react';
import { StyleSheet } from 'react-native';
import { PhoneInput, PhoneInputRef } from 'rn-phone-input-field';

interface InputPhoneUiProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  defaultCountry?: string;
  onSelectCountryCode?: (country: any) => void;
  style?: object;
}

const InputPhoneUi = forwardRef<PhoneInputRef, InputPhoneUiProps>(
  (
    {
      value,
      onChangeText,
      placeholder = 'Введіть номер телефону',
      defaultCountry = 'UA',
      onSelectCountryCode,
      style,
    },
    ref
  ) => {

    return (
      <PhoneInput
        ref={ref}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        defaultCountry={defaultCountry}
        downArrowIcon={null}
        onSelectCountryCode={onSelectCountryCode}
        containerStyle={[
          styles.container,
          style,
        ]}
        textInputStyle={styles.textInput}
        layout="first"
        withDarkTheme={false}
        autoFocus={false}
      />
    );
  }
);

InputPhoneUi.displayName = 'InputPhoneUi';

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: colors.borderColor,
    backgroundColor: colors.white,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 12,
    width: '100%',
    height: 56,
  },
 
  textInput: {
    fontSize: 16,
    color: colors.textColor,
  },
});

export default InputPhoneUi;