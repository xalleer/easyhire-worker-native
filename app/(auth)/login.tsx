import ButtonUi from '@/components/ui/ButtonUi';
import InputPhoneUi from '@/components/ui/InputPhoneUi';
import InputUi from '@/components/ui/InputUi';
import ToggleUi from '@/components/ui/ToggleUi';
import { useLogin } from '@/hooks/useLogin';
import colors from '@/theme/colors';
import typography from '@/theme/typography';
import React, { useRef, useState } from 'react';
import {router} from 'expo-router';
import {
  Image,
  Keyboard,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { PhoneInputRef } from 'rn-phone-input-field';
import IconApple from "@/assets/icons/IconApple";
import IconGoogle from "@/assets/icons/IconGoogle";


export default function LoginScreen() {
  const { login, loading, error } = useLogin();
  const [countryCode, setCountryCode] = useState('')
  const [isEmailSelected, setIsEmailSelected] = useState(false);
  const [phone, setPhone] = useState('+380');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const phoneInputRef = useRef<PhoneInputRef>(null);

  const handlePhoneChange = (phoneNumber: string) => {
    setPhone(phoneNumber);
    setPhoneError('');
  };

  const handleEmailChange = (val: string) => {
    setEmail(val);
    setEmailError('');
  };

  const handlePasswordChange = (val: string) => {
    setPassword(val);
    setPasswordError('');
  };

  const handleToggle = (val: boolean) => {
    setIsEmailSelected(val);
    setPhone('+380');
    setEmail('');
    setPassword('');
    setPhoneError('');
    setEmailError('');
    setPasswordError('');
  };


  const validate = (): boolean => {
    let valid = true;

    if (isEmailSelected) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setEmailError('Введіть коректну електронну пошту');
        valid = false;
      }
    } else {
      const isValid = phoneInputRef.current?.isValidNumber(phone);
      if (!isValid) {
        setPhoneError('Невірний номер телефону');
        valid = false;
      }
    }

    if (password.length < 6) {
      setPasswordError('Пароль має містити щонайменше 6 символів');
      valid = false;
    }

    return valid;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    if(isEmailSelected) {
      login({email, password})
    } else {
      if (countryCode) {
        await login({ phone: `${countryCode}${phone}`, password }); 
      }else {
        await login({ phone: `+380${phone}`, password }); 
      }
    }
  };

  return (
    
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Text style={typography.title}>Welcome Back</Text>
        <Text style={[typography.subtitle, styles.subtitle]}>
          Please enter your email address and password for login
        </Text>

        <View style={styles.toggleContainer}>
          <Image
            style={{ width: 24, height: 24 }}
            source={
              !isEmailSelected
                ? require('@/assets/icons/icon-phone__checked.png')
                : require('@/assets/icons/icon-phone.png')
            }
          />
          <ToggleUi value={isEmailSelected} onValueChange={handleToggle} />
          <Image
            style={{ width: 24, height: 24 }}
            source={
              isEmailSelected
                ? require('@/assets/icons/icon-email__checked.png')
                : require('@/assets/icons/icon-email.png')
            }
          />
        </View>

        <View style={styles.form}>
          {isEmailSelected ? (
            <>
              <InputUi
                value={email}
                onChangeText={handleEmailChange}
                placeholder="Введіть пошту"
                type="email"
              />
              {emailError ? (
                <Text style={styles.errorText}>{emailError}</Text>
              ) : null}
            </>
          ) : (
            <>
              <InputPhoneUi
                ref={phoneInputRef}
                value={phone}
                onChangeText={handlePhoneChange}
                placeholder="Введіть номер телефону"
                defaultCountry="UA"
                onSelectCountryCode={(country) =>
                  setCountryCode(`+${country.callingCode}`)
                }
              />
              {phoneError ? (
                <Text style={styles.errorText}>{phoneError}</Text>
              ) : null}
            </>
          )}

          <InputUi
            value={password}
            onChangeText={handlePasswordChange}
            placeholder="Введіть пароль"
            type="password"
          />
          {passwordError ? (
            <Text style={styles.errorText}>{passwordError}</Text>
          ) : null}

          <ButtonUi
            title="Forgot Password?"
            style={{
              alignSelf: 'flex-end',
              paddingVertical: 0,
              paddingRight: 0,
              color: colors.textColor,
            }}
            onPress={() => {}}
            variant="clear"
          />

          <ButtonUi title="Login" disabled={loading} loading={loading} onPress={handleLogin} variant="fill" />
        </View>

        <View style={styles.socialContainer}>
          <Text>Sign In With</Text>
          <View style={styles.socialIcons}>
            <IconApple/>
            <IconGoogle/>
          </View>
        </View>
        <Text style={{ marginTop: 24, textAlign: 'center' }}>Not Registered Yet? <Text onPress={() => router.push('/(auth)/register')} style={styles.buttonLink}>Sign Up</Text></Text>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: 40,
    paddingLeft: 24,
    paddingRight: 24,
    backgroundColor: colors.background,
  },
  subtitle: {
    width: '60%',
    marginBottom: 12,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    marginVertical: 24,
  },
  form: {
    width: '100%',
    gap: 16,
  },
  errorText: {
    color: 'red',
    marginTop: -12,
    marginBottom: 8,
    marginLeft: 4,
    fontSize: 12,
  },
  socialContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 30,
    marginTop: 32,
  },
  socialIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 30,
  },
  buttonLink: {
    color: colors.lightGreen,
  }
});