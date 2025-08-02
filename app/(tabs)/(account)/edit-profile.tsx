import { router } from 'expo-router';
import { ActivityIndicator, Button, Pressable, StyleSheet, Text, View, ScrollView, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Platform } from 'react-native';
import { useState, useRef, useEffect } from 'react';
import AvatarUi from '@/components/ui/AvatarUi';
import colors from '@/theme/colors';
import { useUserStore } from '@/store/userStore';
import InputUi from '@/components/ui/InputUi';
import InputPhoneUi from '@/components/ui/InputPhoneUi';
import InputAutocomplete from '@/components/ui/InputAutocomplete';
import ButtonUi from '@/components/ui/ButtonUi';
import { CitiesService, City } from '@/services/CitiesService';
import { PhoneInputRef } from 'rn-phone-input-field';

export default function EditProfile() {
    const { user } = useUserStore();

    // Функція для парсингу номера телефону
    const parsePhoneNumber = (phoneNumber: string) => {
        if (!phoneNumber) return { countryCode: '+380', number: '' };

        // Якщо номер починається з +380, витягуємо код країни та номер
        if (phoneNumber.startsWith('+380')) {
            return {
                countryCode: '+380',
                number: phoneNumber.substring(4) // Забираємо +380
            };
        }

        // Якщо номер починається з +, знаходимо код країни
        if (phoneNumber.startsWith('+')) {
            // Припускаємо, що код країни може бути 1-4 цифри
            const match = phoneNumber.match(/^(\+\d{1,4})(.*)$/);
            if (match) {
                return {
                    countryCode: match[1],
                    number: match[2]
                };
            }
        }

        // За замовчуванням використовуємо +380
        return {
            countryCode: '+380',
            number: phoneNumber
        };
    };

    const parsedPhone = parsePhoneNumber(user?.phone || '');

    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: parsedPhone.number,
        city: user?.cities?.[0] || ''
    });
    const [cities, setCities] = useState<City[]>([]);
    const [validCities, setValidCities] = useState<string[]>([]);
    const [isCityFromList, setIsCityFromList] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [focusedFields, setFocusedFields] = useState<Record<string, boolean>>({});
    const [countryCode, setCountryCode] = useState(parsedPhone.countryCode);

    const phoneInputRef = useRef<PhoneInputRef>(null);
    const citiesService = new CitiesService();

    const handleFieldChange = (fieldName: string, value: string) => {
        const newFormData = { ...formData, [fieldName]: value };
        setFormData(newFormData);

        if (errors[fieldName]) {
            setErrors(prev => ({ ...prev, [fieldName]: '' }));
        }

        if (fieldName === 'city') {
            setIsCityFromList(false);
            if (value.trim()) {
                citiesService.searchCities(value, (fetchedCities) => {
                    setCities(fetchedCities);
                    const cityNames = fetchedCities.map(city =>
                        `${city.name}${city.region ? ` (${city.region})` : ''}`
                    );
                    setValidCities(cityNames);
                });
            } else {
                // Якщо поле порожнє, очищуємо списки
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

    const validateField = (fieldName: string, value: string): string | null => {
        if (fieldName === 'city' && value && !isCityFromList && !validCities.includes(value)) {
            return 'Оберіть місто зі списку';
        }
        if (fieldName === 'phone' && value) {
            const isValid = phoneInputRef.current?.isValidNumber(value);
            if (!isValid) {
                return 'Невірний номер телефону';
            }
        }
        return null;
    };

    const handleSubmit = () => {
        const newErrors: Record<string, string> = {};
        let isValid = true;

        ['name', 'email', 'phone', 'city'].forEach(field => {
            const error = validateField(field, formData[field]);
            if (error) {
                newErrors[field] = error;
                isValid = false;
            }
        });

        setErrors(newErrors);

        if (isValid) {
            const dataToSubmit = {
                ...formData,
                phone: `${countryCode}${formData.phone}`
            };
            console.log('Submitting:', dataToSubmit);
            // Add your submission logic here
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
                    <AvatarUi updateMode={false} size={128} name={user?.name} />
                    <View style={styles.form}>
                        <View style={{ justifyContent: 'flex-end', width: '100%', alignItems: 'flex-end' }}>
                            <ButtonUi
                                variant={'clear'}
                                title={'Update'}
                                onPress={handleSubmit}
                            />
                        </View>
                        {formData.name && (
                            <View>
                                <InputUi
                                    value={formData.name}
                                    onChangeText={(val) => handleFieldChange('name', val)}
                                    placeholder="Name"
                                />
                                {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
                            </View>
                        )}
                        {formData.email && (
                            <View>
                                <InputUi
                                    value={formData.email}
                                    onChangeText={(val) => handleFieldChange('email', val)}
                                    placeholder="Email"
                                    type="email"
                                />
                                {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
                            </View>
                        )}
                        <View>
                            <InputPhoneUi
                                ref={phoneInputRef}
                                value={formData.phone}
                                onChangeText={(val) => handleFieldChange('phone', val)}
                                placeholder="Phone number"
                                defaultCountry="UA"
                                onSelectCountryCode={(country) => setCountryCode(`+${country.callingCode}`)}
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
                                onChangeText={(val) => handleFieldChange('city', val)}
                                onSelect={(selectedCity) => handleCitySelect(selectedCity)}
                                onFocus={() => setFocusedFields(prev => ({ ...prev, city: true }))}
                                onBlur={() => {
                                    setFocusedFields(prev => ({ ...prev, city: false }));
                                    const error = validateField('city', formData.city);
                                    if (error) {
                                        setErrors(prev => ({ ...prev, city: error }));
                                    }
                                }}
                                keyboardShouldPersistTaps="handled"
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
        zIndex: 1000, // Додаємо високий z-index для випадаючого списку
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
        elevation: 5, // Для Android
        shadowColor: '#000', // Для iOS
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