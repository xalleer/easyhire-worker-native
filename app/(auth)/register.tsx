import { router } from 'expo-router';
import {
  Button,
  Keyboard,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import colors from '@/theme/colors';
import typography from '@/theme/typography';
import InputUi from '@/components/ui/InputUi';
import React, { useState, useEffect } from 'react';
import ButtonUi from '@/components/ui/ButtonUi';
import IconApple from '@/assets/icons/IconApple';
import IconGoogle from '@/assets/icons/IconGoogle';
import InputAutocomplete from '@/components/ui/InputAutocomplete';
import { City, CitiesService } from '@/services/CitiesService';
import InputPhoneUi from "@/components/ui/InputPhoneUi";

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [cities, setCities] = useState<City[]>([]);
  const [next, setNext] = useState(false);
  const [isFocusedCity, setIsFocusedCity] = useState(false);
  const citiesService = new CitiesService();

  const handleEmailChange = (val: string) => {
    setEmail(val);
  };

  const handlePasswordChange = (val: string) => {
    setPassword(val);
  };

  const handleNameChange = (val: string) => {
    setName(val);
  };

  const handleCityChange = (val: string) => {
    setCity(val);
    citiesService.searchCities(val, (fetchedCities) => {
      setCities(fetchedCities);
    });
  };

  const handleCitySelect = (selectedCity: string) => {
    setCity(selectedCity);
    setCities([]);
  };

  const handlePhoneChange = (val: string) => {
    setPhone(val);
  };

  const handleNextStep = () => {
    // Basic validation
    if (!name || !email || !password) {
      console.log('Please fill all fields');
      return;
    }
    setNext(true);
  };

  const handleRegister = () => {
    // Implement registration logic here
    console.log('Registering with:', { name, email, password, city });
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
                  <InputUi
                      value={email}
                      onChangeText={handleEmailChange}
                      placeholder="Введіть пошту"
                      type="email"
                  />
                  <InputUi
                      value={password}
                      onChangeText={handlePasswordChange}
                      placeholder="Введіть пароль"
                      type="password"
                  />
                  <ButtonUi title="Далі" onPress={handleNextStep} />
                </View>

                <View style={styles.socialContainer}>
                  <Text style={typography.subtitle}>Sign In With</Text>
                  <View style={styles.socialIcons}>
                    <IconApple />
                    <IconGoogle />
                  </View>
                </View>
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

                  <InputPhoneUi value={city} onChangeText={handlePhoneChange} />


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
                      onBlur={() => setIsFocusedCity(false)}
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
});