import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import CountryPicker, {
    Country,
    CountryCode,
} from 'react-native-country-picker-modal';

export type PhoneInputValue = {
    countryCode: CountryCode;
    callingCode: string;
    number: string;
    fullNumber: string; 
};

export type PhoneInputRef = {
    isValidNumber: (phoneNumber: string) => boolean;
    getValue: () => PhoneInputValue;
    focus: () => void;
};

type Props = {
    onChange?: (value: PhoneInputValue) => void;
    onChangeText?: (text: string) => void; 
    initialCountryCode?: CountryCode;
    placeholder?: string;
    value?: string; 
    inputProps?: TextInputProps;
    style?: any;
    error?: boolean;
};

const PhoneInput = forwardRef<PhoneInputRef, Props>(({
    onChange,
    onChangeText,
    initialCountryCode = 'UA',
    placeholder = 'Номер телефону',
    value = '',
    inputProps,
    style,
    error = false,
}, ref) => {
    const [countryCode, setCountryCode] = useState<CountryCode>(initialCountryCode);
    const [callingCode, setCallingCode] = useState<string>('380');
    const [phoneNumber, setPhoneNumber] = useState<string>(value.replace(/^\+\d+/, '') || '');

    // Простая валидация номера телефона
    const isValidNumber = (phone: string) => {
        // Убираем все не-цифры
        const cleanPhone = phone.replace(/\D/g, '');
        // Проверяем, что длина от 9 до 15 цифр
        return cleanPhone.length >= 9 && cleanPhone.length <= 15;
    };

    const getCurrentValue = (): PhoneInputValue => ({
        countryCode,
        callingCode,
        number: phoneNumber,
        fullNumber: `+${callingCode}${phoneNumber}`,
    });

    useImperativeHandle(ref, () => ({
        isValidNumber: (phone: string) => isValidNumber(phone),
        getValue: getCurrentValue,
        focus: () => {
            // Фокус на инпут
        }
    }));

    const handleSelect = (country: Country) => {
        setCountryCode(country.cca2);
        setCallingCode(country.callingCode[0]);

        const newValue = {
            countryCode: country.cca2,
            callingCode: country.callingCode[0],
            number: phoneNumber,
            fullNumber: `+${country.callingCode[0]}${phoneNumber}`,
        };

        onChange?.(newValue);
        onChangeText?.(newValue.fullNumber);
    };

    const handlePhoneChange = (text: string) => {
        // Удаляем все кроме цифр
        const cleanText = text.replace(/\D/g, '');
        setPhoneNumber(cleanText);

        const newValue = {
            countryCode,
            callingCode,
            number: cleanText,
            fullNumber: `+${callingCode}${cleanText}`,
        };

        onChange?.(newValue);
        onChangeText?.(newValue.fullNumber);
    };

    return (
        <View style={[styles.container, style, error && styles.errorBorder]}>
            {/* Левая часть: Флаг и код страны */}
            <View style={styles.countrySection}>
                <CountryPicker
                    countryCode={countryCode}
                    withFlag
                    withCallingCode
                    withFilter
                    withAlphaFilter
                    onSelect={handleSelect}
                    containerButtonStyle={styles.countryPicker}
                />
                <Text style={styles.callingCode}>
                    +{callingCode}
                </Text>
            </View>

            {/* Правая часть: Ввод номера */}
            <TextInput
                style={[styles.input, inputProps?.style]}
                placeholder={placeholder}
                placeholderTextColor="#999"
                keyboardType="phone-pad"
                value={phoneNumber}
                onChangeText={handlePhoneChange}
                maxLength={15}
                {...inputProps}
            />
        </View>
    );
});

PhoneInput.displayName = 'PhoneInput';

export default PhoneInput;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: '#E5E5E5',
        borderRadius: 16,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        minHeight: 56,
    },
    errorBorder: {
        borderColor: '#FF3B30',
    },
    countrySection: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 12,
        paddingRight: 8,
        borderRightWidth: 1,
        borderRightColor: '#E5E5E5',
        minHeight: 46,
        justifyContent: 'center',
    },
    countryPicker: {
        padding: 0,
        margin: 0,
    },
    callingCode: {
        fontSize: 16,
        color: '#333333',
        marginLeft: 6,
        fontWeight: '500',
        minWidth: 35,
    },
    input: {
        flex: 1,
        paddingHorizontal: 12,
        paddingVertical: 12,
        fontSize: 16,
        color: '#333333',
    },
});