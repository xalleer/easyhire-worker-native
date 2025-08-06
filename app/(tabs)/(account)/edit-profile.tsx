import AvatarUi from '@/components/ui/AvatarUi';
import ButtonUi from '@/components/ui/ButtonUi';
import InputAutocomplete from '@/components/ui/InputAutocomplete';
import InputUi from '@/components/ui/InputUi';
import PhoneInput, { PhoneInputRef, PhoneInputValue } from '@/components/ui/PhoneInput';
import { CitiesService, City } from '@/services/CitiesService';
import { useUserStore } from '@/store/userStore';
import colors from '@/theme/colors';
import { useRef, useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';

interface FormData {
  name: string;
  email: string;
  phone: string;
  city: string;
}

interface ParsedPhone {
  countryCode: string;
  number: string;
}

export default function EditProfile() {
  const { user } = useUserStore();

  const parsePhoneNumber = (phoneNumber: string): ParsedPhone => {
    if (!phoneNumber) return { countryCode: 'UA', number: '' };

    const phonePatterns: { [key: string]: string } = {
      '+380': 'UA',
      '+7': 'RU',
      '+1': 'US',
      '+44': 'GB',
      '+33': 'FR',
      '+49': 'DE',
      '+48': 'PL',
    };

    for (const [prefix, countryCode] of Object.entries(phonePatterns)) {
      if (phoneNumber.startsWith(prefix)) {
        return {
          countryCode,
          number: phoneNumber.substring(prefix.length),
        };
      }
    }

    const match = phoneNumber.match(/^(\+\d{1,4})(.*)$/);
    return {
      countryCode: 'UA',
      number: match ? match[2] : phoneNumber,
    };
  };

  const parsedPhone = parsePhoneNumber(user?.phone || '');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: user?.name || '',
    email: user?.email || '',
    phone: parsedPhone.number,
    city: user?.cities?.[0] || '',
  });
  const [initialCountryCode, setInitialCountryCode] = useState<string>(parsedPhone.countryCode);
  const [cities, setCities] = useState<City[]>([]);
  const [validCities, setValidCities] = useState<string[]>([]);
  const [isCityFromList, setIsCityFromList] = useState<boolean>(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [focusedFields, setFocusedFields] = useState<Partial<Record<keyof FormData, boolean>>>({});
  const [currentPhoneData, setCurrentPhoneData] = useState<PhoneInputValue | null>(null);

  const phoneInputRef = useRef<PhoneInputRef>(null);
  const citiesService = new CitiesService();

  const handleFieldChange = (fieldName: keyof FormData, value: string) => {
    const newFormData = { ...formData, [fieldName]: value };
    setFormData(newFormData);

    if (errors[fieldName]) {
      setErrors(prev => ({ ...prev, [fieldName]: '' }));
    }

    if (fieldName === 'city') {
      setIsCityFromList(false);
      if (value.trim()) {
        citiesService.searchCities(value, (fetchedCities: City[]) => {
          setCities(fetchedCities);
          const cityNames = fetchedCities.map(city =>
            `${city.name}${city.region ? ` (${city.region})` : ''}`
          );
          setValidCities(cityNames);
        });
      } else {
        setCities([]);
        setValidCities([]);
      }
    }
  };

  const handleCitySelect = (selectedCity: string) => {
    setFormData(prev => ({ ...prev, city: selectedCity }));
    setCities([]);
    setIsCityFromList(true);
    if (errors.city) {
      setErrors(prev => ({ ...prev, city: '' }));
    }
  };

  const validateField = (fieldName: keyof FormData, value: string): string | null => {
    if (fieldName === 'city' && value && !isCityFromList && !validCities.includes(value)) {
      return 'Оберіть місто зі списку';
    }
    if (fieldName === 'phone' && value) {
      const isValid = phoneInputRef.current?.isValidNumber(currentPhoneData?.fullNumber || value);
      if (!isValid) {
        return 'Невірний номер телефону';
      }
    }
    return null;
  };

  const handleToggleEdit = () => {
    if (isEditing) {
      const newErrors: Partial<Record<keyof FormData, string>> = {};
      let isValid = true;

      (['name', 'email', 'phone', 'city'] as (keyof FormData)[]).forEach(field => {
        const error = validateField(field, formData[field]);
        if (error) {
          newErrors[field] = error;
          isValid = false;
        }
      });

      setErrors(newErrors);

      if (isValid) {
        const submitData = {
          ...formData,
          phone: currentPhoneData?.fullNumber || formData.phone,
        };
        console.log('Submitting:', submitData);
        setIsEditing(false);
      }
    } else {
      setIsEditing(true);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          nestedScrollEnabled={true}
        >
          <AvatarUi updateMode={isEditing} size={128} name={user?.name} />
          <View style={styles.form}>
            <View style={{ justifyContent: 'flex-end', width: '100%', alignItems: 'flex-end' }}>
              <ButtonUi
                variant={'clear'}
                title={isEditing ? 'Save' : 'Update'}
                onPress={handleToggleEdit}
              />
            </View>
            {formData.name && (
              <View>
                <InputUi
                  value={formData.name}
                  onChangeText={(val: string) => handleFieldChange('name', val)}
                  placeholder="Name"
                  editable={isEditing}
                />
                {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
              </View>
            )}
            {formData.email && (
              <View>
                <InputUi
                  value={formData.email}
                  onChangeText={(val: string) => handleFieldChange('email', val)}
                  placeholder="Email"
                  type="email"
                  editable={isEditing}
                />
                {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
              </View>
            )}
            <View>
              <PhoneInput
                ref={phoneInputRef}
                value={formData.phone}
                onChangeText={(phoneNumber: string) => handleFieldChange('phone', phoneNumber)}
                onChange={(phoneValue: PhoneInputValue) => {
                  setCurrentPhoneData(phoneValue);
                  console.log('Phone data:', phoneValue);
                }}
                placeholder="Phone number"
                initialCountryCode={initialCountryCode}
                error={!!errors.phone}
                inputProps={{
                  editable: isEditing,
                  onFocus: () => setFocusedFields(prev => ({ ...prev, phone: true })),
                  onBlur: () => {
                    setFocusedFields(prev => ({ ...prev, phone: false }));
                    const error = validateField('phone', formData.phone);
                    if (error) {
                      setErrors(prev => ({ ...prev, phone: error }));
                    }
                  },
                }}
              />
              {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
            </View>
            <View style={styles.cityContainer}>
              <InputAutocomplete
                data={cities.map(city => `${city.name}${city.region ? ` (${city.region})` : ''}`)}
                placeholder="City"
                style={styles.autocomplete}
                inputStyle={[
                  styles.autocompleteInput,
                  { borderColor: focusedFields.city ? colors.lightGreen : colors.borderColor },
                ]}
                listStyle={styles.autocompleteList}
                listItemStyle={styles.autocompleteListItem}
                textStyle={styles.autocompleteText}
                value={formData.city}
                onChangeText={(val: string) => handleFieldChange('city', val)}
                onSelect={handleCitySelect}
                onFocus={() => setFocusedFields(prev => ({ ...prev, city: true }))}
                onBlur={() => {
                  setFocusedFields(prev => ({ ...prev, city: false }));
                  const error = validateField('city', formData.city);
                  if (error) {
                    setErrors(prev => ({ ...prev, city: error }));
                  }
                }}
                editable={isEditing}
              />
              {errors.city && <Text style={styles.errorText}>{errors.city}</Text>}
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    alignItems: 'center',
    paddingTop: 32,
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  form: {
    width: '100%',
    gap: 16,
  },
  cityContainer: {
    width: '100%',
    zIndex: 1000,
  },
  errorText: {
    color: 'red',
    marginTop: 12,
    marginBottom: 8,
    marginLeft: 4,
    fontSize: 12,
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
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    zIndex: 1001,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
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
});