import * as Location from 'expo-location';
import React, { useEffect, useRef, useState } from 'react';
import {
    Alert,
    Image,
    Keyboard,
    ScrollView,
    StyleSheet,
    Text,
    TouchableWithoutFeedback,
    View
} from 'react-native';

import SocialLogin from '@/components/SocialLogin';
import ButtonUi from '@/components/ui/ButtonUi';
import InputAutocomplete from '@/components/ui/InputAutocomplete';
import InputUi from '@/components/ui/InputUi';
import PhoneInput, { PhoneInputRef, PhoneInputValue } from '@/components/ui/PhoneInput';
import ToggleUi from '@/components/ui/ToggleUi';
import { CitiesService, City } from '@/services/CitiesService';
import colors from '@/theme/colors';
import typography from '@/theme/typography';

export type FieldType =
    | 'text'
    | 'email'
    | 'password'
    | 'phone'
    | 'city'
    | 'code';

export interface FieldConfig {
    name: string;
    type: FieldType;
    placeholder: string;
    validation?: {
        required?: boolean;
        minLength?: number;
        maxLength?: number;
        pattern?: RegExp;
        custom?: (value: string, formData?: Record<string, string>) => string | null;
    };
    props?: any;
}

export interface ButtonConfig {
    title: string;
    variant?: 'fill' | 'outline' | 'clear';
    onPress: (formData: Record<string, string>) => void | Promise<void>;
    disabled?: boolean;
    loading?: boolean;
    style?: any;
    position?: 'before-main' | 'after-main';
}

export interface ToggleConfig {
    value: boolean;
    onValueChange: (value: boolean) => void;
    leftIcon: any;
    rightIcon: any;
    leftIconActive: any;
    rightIconActive: any;
}

export interface AvatarConfig {
    onPress?: () => void;
    source?: any;
    style?: any;
}

export interface BottomLinkConfig {
    text: string;
    linkText: string;
    onLinkPress: () => void;
}

export interface AuthScreenConfig {
    title: string;
    subtitle: string;
    fields: FieldConfig[];
    buttons: ButtonConfig[];
    initialValues?: Record<string, string>;
    onFieldChange?: (fieldName: string, value: string, allValues: Record<string, string>) => void;
    toggle?: ToggleConfig;
    avatar?: AvatarConfig;
    showSocialLogin?: boolean;
    bottomLink?: BottomLinkConfig;
    showLocationButton?: boolean;
    scrollable?: boolean;
}

interface AuthScreenProps {
    config: AuthScreenConfig;
    loading?: boolean;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ config, loading = false }) => {
    const [formData, setFormData] = useState<Record<string, string>>(
        config.initialValues || {}
    );
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [cities, setCities] = useState<City[]>([]);
    const [validCities, setValidCities] = useState<string[]>([]);
    const [isCityFromList, setIsCityFromList] = useState(false);
    const [focusedFields, setFocusedFields] = useState<Record<string, boolean>>({});
    const [locationLoading, setLocationLoading] = useState(false);

    const phoneInputRef = useRef<PhoneInputRef>(null);
    const citiesService = new CitiesService();

    useEffect(() => {
        const initialData: Record<string, string> = {};
        config.fields.forEach(field => {
            if (field.type === 'phone') {
                initialData[field.name] = config.initialValues?.[field.name] || '+380';
            } else {
                initialData[field.name] = config.initialValues?.[field.name] || '';
            }
        });
        setFormData(initialData);
    }, [config]);

    const handleFieldChange = (fieldName: string, value: string) => {
        const newFormData = { ...formData, [fieldName]: value };
        setFormData(newFormData);

        if (errors[fieldName]) {
            setErrors(prev => ({ ...prev, [fieldName]: '' }));
        }

        config.onFieldChange?.(fieldName, value, newFormData);

        const field = config.fields.find(f => f.name === fieldName);
        if (field?.type === 'city') {
            setIsCityFromList(false);
            citiesService.searchCities(value, (fetchedCities) => {
                setCities(fetchedCities);
                const cityNames = fetchedCities.map(city =>
                    `${city.name}${city.region ? ` (${city.region})` : ''}`
                );
                setValidCities(cityNames);
            });
        }
    };

    const handleCitySelect = (fieldName: string, selectedCity: string) => {
        setFormData(prev => ({ ...prev, [fieldName]: selectedCity }));
        setCities([]);
        setIsCityFromList(true);
        if (errors[fieldName]) {
            setErrors(prev => ({ ...prev, [fieldName]: '' }));
        }
    };

    const validateField = (field: FieldConfig, value: string): string | null => {
        const { validation } = field;
        if (!validation) return null;

        if (validation.required && !value.trim()) {
            return `Поле "${field.placeholder}" є обов'язковим`;
        }

        if (validation.minLength && value.length < validation.minLength) {
            return `Мінімальна довжина: ${validation.minLength} символів`;
        }

        if (validation.maxLength && value.length > validation.maxLength) {
            return `Максимальна довжина: ${validation.maxLength} символів`;
        }

        if (validation.pattern && !validation.pattern.test(value)) {
            if (field.type === 'email') {
                return 'Введіть коректну електронну пошту';
            }
            return 'Некоректний формат';
        }

        if (validation.custom) {
            return validation.custom(value, formData);
        }

        if (field.type === 'phone') {
            const isValid = phoneInputRef.current?.isValidNumber(value);
            if (!isValid) {
                return 'Невірний номер телефону';
            }
        }

        if (field.type === 'city') {
            if (!isCityFromList && !validCities.includes(value)) {
                return 'Оберіть місто зі списку';
            }
        }

        return null;
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};
        let isValid = true;

        config.fields.forEach(field => {
            const error = validateField(field, formData[field.name] || '');
            if (error) {
                newErrors[field.name] = error;
                isValid = false;
            }
        });

        setErrors(newErrors);
        return isValid;
    };

    const handleButtonPress = async (button: ButtonConfig) => {
        const shouldValidate = button.variant !== 'clear' && button.variant !== 'outline';

        if (shouldValidate && !validateForm()) return;

        try {
            await button.onPress(formData);
        } catch (error) {
            console.error('Form submission error:', error);
        }
    };

    const getCurrentLocation = async () => {
        const cityField = config.fields.find(f => f.type === 'city');
        if (!cityField) return;

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
            const reverseGeocode = await Location.reverseGeocodeAsync({
                latitude,
                longitude,
            });

            if (reverseGeocode.length > 0) {
                const address = reverseGeocode[0];
                const cityName = address.city || address.subregion || address.region;

                if (cityName) {
                    const fetchedCities = await citiesService.getCities(cityName);
                    if (fetchedCities.length > 0) {
                        const foundCity = fetchedCities[0];
                        const cityDisplayName = `${foundCity.name}${foundCity.region ? ` (${foundCity.region})` : ''}`;
                        handleFieldChange(cityField.name, cityDisplayName);
                        setIsCityFromList(true);
                    } else {
                        Alert.alert('Увага', `Місто "${cityName}" не знайдено в базі. Оберіть місто зі списку.`);
                    }
                }
            }
        } catch (error) {
            console.error('Geolocation error:', error);
            Alert.alert('Помилка', 'Не вдалося визначити місцезнаходження');
        } finally {
            setLocationLoading(false);
        }
    };

    const renderField = (field: FieldConfig) => {
        const value = formData[field.name] || '';
        const error = errors[field.name];
        const isFocused = focusedFields[field.name];

        switch (field.type) {
            case 'phone':
                return (
                    <View key={field.name}>
                        <PhoneInput
                            ref={phoneInputRef}
                            value={value}
                            onChangeText={(fullNumber) => handleFieldChange(field.name, fullNumber)}
                            onChange={(phoneValue: PhoneInputValue) => {
                                console.log('Phone data:', phoneValue);
                            }}
                            placeholder={field.placeholder}
                            initialCountryCode="UA"
                            error={!!error}
                            inputProps={{
                                onFocus: () => setFocusedFields(prev => ({ ...prev, [field.name]: true })),
                                onBlur: () => {
                                    setFocusedFields(prev => ({ ...prev, [field.name]: false }));
                                    const fieldError = validateField(field, value);
                                    if (fieldError) {
                                        setErrors(prev => ({ ...prev, [field.name]: fieldError }));
                                    }
                                }
                            }}
                            {...field.props}
                        />
                        {error ? <Text style={styles.errorText}>{error}</Text> : null}
                    </View>
                );

            case 'city':
                return (
                    <View key={field.name}>
                        <InputAutocomplete
                            data={cities.map(city => `${city.name}${city.region ? ` (${city.region})` : ''}`)}
                            placeholder={field.placeholder}
                            style={styles.autocomplete}
                            inputStyle={[
                                styles.autocompleteInput,
                                { borderColor: isFocused ? colors.lightGreen : colors.borderColor },
                            ]}
                            listStyle={styles.autocompleteList}
                            listItemStyle={styles.autocompleteListItem}
                            textStyle={styles.autocompleteText}
                            value={value}
                            onChangeText={(val) => handleFieldChange(field.name, val)}
                            onSelect={(selectedCity) => handleCitySelect(field.name, selectedCity)}
                            onFocus={() => setFocusedFields(prev => ({ ...prev, [field.name]: true }))}
                            onBlur={() => {
                                setFocusedFields(prev => ({ ...prev, [field.name]: false }));
                                const fieldError = validateField(field, value);
                                if (fieldError) {
                                    setErrors(prev => ({ ...prev, [field.name]: fieldError }));
                                }
                            }}
                            {...field.props}
                        />
                        {error ? <Text style={styles.errorText}>{error}</Text> : null}
                    </View>
                );

            default:
                return (
                    <View key={field.name}>
                        <InputUi
                            value={value}
                            onChangeText={(val) => handleFieldChange(field.name, val)}
                            placeholder={field.placeholder}
                            type={field.type as any}
                            {...field.props}
                        />
                        {error ? <Text style={styles.errorText}>{error}</Text> : null}
                    </View>
                );
        }
    };

    const renderAvatar = () => {
        if (!config.avatar) return null;

        return (
            <View style={styles.avatarContainer}>
                <View style={[styles.emptyAvatar, config.avatar.style]}>
                    {config.avatar.source ? (
                        <Image source={config.avatar.source} style={styles.avatarImage} />
                    ) : (
                        <Text style={styles.plus}>+</Text>
                    )}
                </View>
            </View>
        );
    };

    const renderToggle = () => {
        if (!config.toggle) return null;

        return (
            <View style={styles.toggleContainer}>
                <Image
                    style={{ width: 24, height: 24 }}
                    source={
                        !config.toggle.value
                            ? config.toggle.leftIconActive
                            : config.toggle.leftIcon
                    }
                />
                <ToggleUi
                    value={config.toggle.value}
                    onValueChange={config.toggle.onValueChange}
                />
                <Image
                    style={{ width: 24, height: 24 }}
                    source={
                        config.toggle.value
                            ? config.toggle.rightIconActive
                            : config.toggle.rightIcon
                    }
                />
            </View>
        );
    };

    const renderForm = () => (
        <View style={styles.form}>
            {config.fields.map(renderField)}

            {config.showLocationButton && config.fields.some(f => f.type === 'city') && (
                <ButtonUi
                    title="Моє місцезнаходження"
                    loading={locationLoading}
                    disabled={locationLoading}
                    variant="outline"
                    onPress={getCurrentLocation}
                />
            )}

            {(() => {
                const beforeMainButtons = config.buttons.filter(b => b.position === 'before-main');
                const mainButtons = config.buttons.filter(b => !b.position || b.position === 'after-main');
                const allButtons = [...beforeMainButtons, ...mainButtons];

                return allButtons.map((button, index) => {
                    const shouldShowLoading = button.loading ||
                        (loading && button.variant === 'fill' && config.buttons.findIndex(b => b.variant === 'fill') === config.buttons.indexOf(button));

                    return (
                        <ButtonUi
                            key={index}
                            title={button.title}
                            variant={button.variant || 'fill'}
                            disabled={button.disabled || shouldShowLoading}
                            loading={shouldShowLoading}
                            onPress={() => handleButtonPress(button)}
                            style={button.style}
                        />
                    );
                });
            })()}
        </View>
    );

    const renderBottomLink = () => {
        if (!config.bottomLink) return null;

        return (
            <Text style={styles.bottomText}>
                {config.bottomLink.text}{' '}
                <Text onPress={config.bottomLink.onLinkPress} style={styles.buttonLink}>
                    {config.bottomLink.linkText}
                </Text>
            </Text>
        );
    };

    const mainContent = (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={typography.title}>{config.title}</Text>
                <Text style={[typography.subtitle, styles.subtitle]}>
                    {config.subtitle}
                </Text>
            </View>

            {renderToggle()}

            {renderAvatar()}

            {renderForm()}

            {config.showSocialLogin && <SocialLogin />}

            {renderBottomLink()}
        </View>
    );

    if (config.scrollable) {
        return (
            <ScrollView style={{ flex: 1, backgroundColor: colors.background }}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    {mainContent}
                </TouchableWithoutFeedback>
            </ScrollView>
        );
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            {mainContent}
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        paddingTop: 40,
        paddingHorizontal: 24,
        backgroundColor: colors.background,
    },
    header: {
        marginBottom: 24,
    },
    subtitle: {
        width: '70%',
        marginBottom: 12,
    },
    toggleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        marginBottom: 24,
    },
    avatarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
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
    avatarImage: {
        width: '100%',
        height: '100%',
        borderRadius: 90,
    },
    plus: {
        color: colors.borderColor,
        fontSize: 60,
        fontWeight: '400',
        lineHeight: 60,
    },
    form: {
        width: '100%',
        gap: 16,
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
    bottomText: {
        marginTop: 24,
        textAlign: 'center',
        fontSize: 16,
        color: colors.black,
    },
    buttonLink: {
        color: colors.lightGreen,
    },
});

export default AuthScreen;