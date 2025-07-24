import { router } from 'expo-router';
import {
  Button,
  Keyboard,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
  Alert,
} from 'react-native';
import colors from '@/theme/colors';
import typography from '@/theme/typography';
import InputUi from '@/components/ui/InputUi';
import React, { useState, useEffect, useRef } from 'react';
import ButtonUi from '@/components/ui/ButtonUi';
import IconApple from '@/assets/icons/IconApple';
import IconGoogle from '@/assets/icons/IconGoogle';
import InputAutocomplete from '@/components/ui/InputAutocomplete';
import { City, CitiesService } from '@/services/CitiesService';
import InputPhoneUi from "@/components/ui/InputPhoneUi";
import SocialLogin from "@/components/SocialLogin";
import { PhoneInputRef } from 'rn-phone-input-field';
import * as Location from 'expo-location';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('+380');
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [cities, setCities] = useState<City[]>([]);
  const [next, setNext] = useState(false);
  const [isFocusedCity, setIsFocusedCity] = useState(false);
  const [countryCode, setCountryCode] = useState('');
  const [validCities, setValidCities] = useState<string[]>([]);
  const [isCityFromList, setIsCityFromList] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);

  // Error states
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [cityError, setCityError] = useState('');

  const citiesService = new CitiesService();
  const phoneInputRef = useRef<PhoneInputRef>(null);

  const handleEmailChange = (val: string) => {
    setEmail(val);
    setEmailError('');
  };

  const handlePasswordChange = (val: string) => {
    setPassword(val);
    setPasswordError('');
  };

  const handleNameChange = (val: string) => {
    setName(val);
    setNameError('');
  };

  const handleCityChange = (val: string) => {
    setCity(val);
    setCityError('');
    setIsCityFromList(false);
    citiesService.searchCities(val, (fetchedCities) => {
      setCities(fetchedCities);
      const cityNames = fetchedCities.map(city => `${city.name}${city.region ? ` (${city.region})` : ''}`);
      setValidCities(cityNames);
    });
  };

  const handleCitySelect = (selectedCity: string) => {
    setCity(selectedCity);
    setCities([]);
    setCityError('');
    setIsCityFromList(true);
  };

  const handlePhoneChange = (val: string) => {
    setPhone(val);
    setPhoneError('');
  };

  const validateFirstStep = (): boolean => {
    let valid = true;

    // Name validation
    if (!name.trim()) {
      setNameError('Введіть ім\'я');
      valid = false;
    } else if (name.trim().length < 2) {
      setNameError('Ім\'я має містити щонайменше 2 символи');
      valid = false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setEmailError('Введіть електронну пошту');
      valid = false;
    } else if (!emailRegex.test(email)) {
      setEmailError('Введіть коректну електронну пошту');
      valid = false;
    }

    // Password validation
    if (!password) {
      setPasswordError('Введіть пароль');
      valid = false;
    } else if (password.length < 6) {
      setPasswordError('Пароль має містити щонайменше 6 символів');
      valid = false;
    }

    return valid;
  };

  const validateSecondStep = (): boolean => {
    let valid = true;

    // Phone validation
    const isValidPhone = phoneInputRef.current?.isValidNumber(phone);
    if (!isValidPhone) {
      setPhoneError('Невірний номер телефону');
      valid = false;
    }

    // City validation
    if (!city.trim()) {
      setCityError('Оберіть місто або село');
      valid = false;
    } else if (!isCityFromList && !validCities.includes(city)) {
      setCityError('Оберіть місто зі списку');
      valid = false;
    }

    return valid;
  };

  const getCurrentLocation = async () => {
    setLocationLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Помилка', 'Дозвіл на використання геолокації відхилено');
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const { latitude, longitude } = location.coords;

      // Отримуємо адресу за координатами
      const reverseGeocode = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (reverseGeocode.length > 0) {
        const address = reverseGeocode[0];
        const cityName = address.city || address.subregion || address.region;

        if (cityName) {
          // Шукаємо місто в API Nova Poshta
          const fetchedCities = await citiesService.getCities(cityName);
          if (fetchedCities.length > 0) {
            const foundCity = fetchedCities[0];
            const cityDisplayName = `${foundCity.name}${foundCity.region ? ` (${foundCity.region})` : ''}`;
            setCity(cityDisplayName);
            setIsCityFromList(true);
            setCityError('');
          } else {
            Alert.alert('Увага', `Місто "${cityName}" не знайдено в базі. Оберіть місто зі списку.`);
          }
        } else {
          Alert.alert('Помилка', 'Не вдалося визначити місто за вашим місцезнаходженням');
        }
      }
    } catch (error) {
      console.error('Geolocation error:', error);
      Alert.alert('Помилка', 'Не вдалося визначити місцезнаходження');
    } finally {
      setLocationLoading(false);
    }
  };

  const handleNextStep = () => {
    if (!validateFirstStep()) {
      return;
    }
    setNext(true);
  };

  const handleRegister = () => {
    if (!validateSecondStep()) {
      return;
    }

    // Registration logic
    const phoneNumber = countryCode ? `${countryCode}${phone}` : `+380${phone}`;
    console.log('Registering with:', { name, email, password, phone: phoneNumber, city });
    // Example: Send data to your backend
  };

  return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          {!next ? (
              <>
                <View>
                  <Text style={typography.title}>Create an account</Text>
                  <Text style={[typography.subtitle, styles.subtitle]}>
                    Please enter your information and create your account
                  </Text>
                </View>

                <View style={styles.form}>
                  <InputUi
                      value={name}
                      onChangeText={handleNameChange}
                      placeholder="Введіть ім'я"
                      type="text"
                  />
                  {nameError ? (
                      <Text style={styles.errorText}>{nameError}</Text>
                  ) : null}

                  <InputUi
                      value={email}
                      onChangeText={handleEmailChange}
                      placeholder="Введіть пошту"
                      type="email"
                  />
                  {emailError ? (
                      <Text style={styles.errorText}>{emailError}</Text>
                  ) : null}

                  <InputUi
                      value={password}
                      onChangeText={handlePasswordChange}
                      placeholder="Введіть пароль"
                      type="password"
                  />
                  {passwordError ? (
                      <Text style={styles.errorText}>{passwordError}</Text>
                  ) : null}

                  <ButtonUi title="Далі" onPress={handleNextStep} />
                </View>

                <SocialLogin/>
              </>
          ) : (
              <>
                <View>
                  <Text style={typography.title}>Fill Profile</Text>
                  <Text style={[typography.subtitle, styles.subtitle]}>
                    Please enter your information and create your account
                  </Text>
                </View>

                <View style={styles.form}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
                    <View style={styles.emptyAvatar}>
                      <Text style={styles.plus}>+</Text>
                    </View>
                  </View>

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

                  <InputAutocomplete
                      data={cities.map(city => `${city.name}${city.region ? ` (${city.region})` : ''}`)}
                      placeholder="Введіть місто або село"
                      style={styles.autocomplete}
                      inputStyle={[
                        styles.autocompleteInput,
                        { borderColor: isFocusedCity ? colors.lightGreen : colors.borderColor },
                      ]}
                      listStyle={styles.autocompleteList}
                      listItemStyle={styles.autocompleteListItem}
                      textStyle={styles.autocompleteText}
                      value={city}
                      onChangeText={handleCityChange}
                      onSelect={handleCitySelect}
                      onFocus={() => setIsFocusedCity(true)}
                      onBlur={() => {
                        setIsFocusedCity(false);
                        // Валідація при втраті фокусу
                        if (city && !isCityFromList && !validCities.includes(city)) {
                          setCityError('Оберіть місто зі списку');
                        }
                      }}
                  />
                  {cityError ? (
                      <Text style={styles.errorText}>{cityError}</Text>
                  ) : null}

                  <ButtonUi
                      title="Моє місцезнаходження"
                      loading={locationLoading}
                      disabled={locationLoading}
                      variant={'outline'}
                      onPress={getCurrentLocation}
                      style={styles.registerButton}
                  />
                  <ButtonUi
                      title="Зареєструватися"
                      onPress={handleRegister}
                      style={styles.registerButton}
                  />
                </View>
              </>
          )}

          <Text style={styles.loginText}>
            Have an Account?{' '}
            <Text
                onPress={() => router.push('/(auth)/login')}
                style={styles.buttonLink}
            >
              Sign In
            </Text>
          </Text>
        </View>
      </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: 40,
    paddingHorizontal: 24,
    backgroundColor: colors.background,
  },
  subtitle: {
    width: '70%',
    marginBottom: 12,
  },
  form: {
    width: '100%',
    gap: 16,
    marginTop: 24,
  },
  socialContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
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
  },
  emptyAvatar: {
    width: 128,
    height: 128,
    borderRadius: 90,
    borderWidth: 1,
    borderColor: colors.borderColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plus: {
    color: colors.borderColor,
    fontSize: 60,
    fontWeight: '400',
    lineHeight: 60,
  },
  autocomplete: {
    width: '100%',
  },
  autocompleteInput: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    backgroundColor: colors.white,
    fontSize: 16,
    color: colors.black,
  },
  autocompleteList: {
    backgroundColor: colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.borderColor,
    borderTopWidth: 0,
    maxHeight: 150,
  },
  autocompleteListItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomColor: colors.borderColor,
  },
  autocompleteText: {
    fontSize: 16,
    color: colors.black,
  },
  registerButton: {
    marginTop: 8,
  },
  loginText: {
    marginTop: 24,
    textAlign: 'center',
    fontSize: 16,
    color: colors.black,
  },
  errorText: {
    color: 'red',
    marginTop: -12,
    marginBottom: 8,
    marginLeft: 4,
    fontSize: 12,
  },
});