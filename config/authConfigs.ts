import { AuthScreenConfig } from '@/components/AuthScreen';
import { router } from 'expo-router';
import colors from '@/theme/colors';

export const loginScreenConfig = (
    isEmailSelected: boolean,
    onToggle: (value: boolean) => void,
    onLogin: (data: any) => void,
    loading?: boolean
): AuthScreenConfig => ({
    title: 'Welcome Back',
    subtitle: 'Please enter your email address and password for login',

    fields: [
        {
            name: 'loginField',
            type: isEmailSelected ? 'email' : 'phone',
            placeholder: isEmailSelected ? 'Введіть пошту' : 'Введіть номер телефону',
            validation: isEmailSelected ? {
                required: true,
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            } : {
                required: true,
            },
        },
        {
            name: 'password',
            type: 'password',
            placeholder: 'Введіть пароль',
            validation: {
                required: true,
                minLength: 6,
            },
        },
    ],

    buttons: [
        {
            title: 'Forgot Password?',
            variant: 'clear',
            position: 'before-main',
            //@ts-ignore
            onPress: () => router.push('/(auth)/forgot-password'),
            style: {
                alignSelf: 'flex-end',
                paddingVertical: 0,
                paddingRight: 0,
                color: colors.textColor,
            },
        },
        {
            title: 'Login',
            variant: 'fill',
            loading,
            onPress: onLogin,
        },
    ],

    toggle: {
        value: isEmailSelected,
        onValueChange: onToggle,
        leftIcon: require('@/assets/icons/icon-phone.png'),
        rightIcon: require('@/assets/icons/icon-email.png'),
        leftIconActive: require('@/assets/icons/icon-phone__checked.png'),
        rightIconActive: require('@/assets/icons/icon-email__checked.png'),
    },

    showSocialLogin: true,

    bottomLink: {
        text: 'Not Registered Yet?',
        linkText: 'Sign Up',
        onLinkPress: () => router.push('/(auth)/register'),
    },
});

export const registerStep1Config = (
    onNext: (data: any) => void,
    loading?: boolean
): AuthScreenConfig => ({
    title: 'Create an account',
    subtitle: 'Please enter your information and create your account',

    fields: [
        {
            name: 'name',
            type: 'text',
            placeholder: "Введіть ім'я",
            validation: {
                required: true,
                minLength: 2,
            },
        },
        {
            name: 'email',
            type: 'email',
            placeholder: 'Введіть пошту',
            validation: {
                required: true,
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            },
        },
        {
            name: 'password',
            type: 'password',
            placeholder: 'Введіть пароль',
            validation: {
                required: true,
                minLength: 6,
            },
        },
    ],

    buttons: [
        {
            title: 'Далі',
            variant: 'fill',
            loading,
            onPress: onNext,
        },
    ],

    showSocialLogin: true,

    bottomLink: {
        text: 'Have an Account?',
        linkText: 'Sign In',
        onLinkPress: () => router.push('/(auth)/login'),
    },
});

export const registerStep2Config = (
    onRegister: (data: any) => void,
    onAvatarPress?: () => void,
    avatarSource?: any,
    loading?: boolean
): AuthScreenConfig => ({
    title: 'Fill Profile',
    subtitle: 'Please enter your information and create your account',

    fields: [
        {
            name: 'phone',
            type: 'phone',
            placeholder: 'Введіть номер телефону',
            validation: {
                required: true,
            },
        },
        {
            name: 'cities',
            type: 'city',
            placeholder: 'Введіть місто або село',
            validation: {
                required: true,
            },
        },
    ],

    buttons: [
        {
            title: 'Зареєструватися',
            variant: 'fill',
            loading,
            onPress: onRegister,
        },
    ],

    avatar: {
        onPress: onAvatarPress,
        source: avatarSource,
    },

    showLocationButton: true,

    bottomLink: {
        text: 'Have an Account?',
        linkText: 'Sign In',
        onLinkPress: () => router.push('/(auth)/login'),
    },
});

export const forgotPasswordStep1Config = (
    onSendCode: (data: any) => void,
    loading?: boolean
): AuthScreenConfig => ({
    title: 'Forgot Password',
    subtitle: 'Please enter your email address to receive verification code',

    fields: [
        {
            name: 'email',
            type: 'email',
            placeholder: 'Введіть електронну пошту',
            validation: {
                required: true,
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            },
        },
    ],

    buttons: [
        {
            title: 'Надіслати код',
            variant: 'fill',
            loading,
            onPress: onSendCode,
        },
    ],

    bottomLink: {
        text: 'Remember your password?',
        linkText: 'Sign In',
        onLinkPress: () => router.push('/(auth)/login'),
    },
});

export const forgotPasswordStep2Config = (
    onVerifyCode: (data: any) => void,
    onResendCode: () => void,
    email: string,
    loading?: boolean
): AuthScreenConfig => ({
    title: 'Verification Code',
    subtitle: `We have sent verification code to ${email}`,

    fields: [
        {
            name: 'code',
            type: 'code',
            placeholder: 'Введіть код з листа',
            validation: {
                required: true,
                minLength: 4,
                maxLength: 6,
                pattern: /^\d+$/,
            },
            props: {
                keyboardType: 'numeric',
                maxLength: 6,
            },
        },
    ],

    buttons: [
        {
            title: 'Підтвердити',
            variant: 'fill',
            loading,
            onPress: onVerifyCode,
        },
        {
            title: 'Надіслати код повторно',
            variant: 'outline',
            onPress: onResendCode,
        },
    ],

    bottomLink: {
        text: 'Remember your password?',
        linkText: 'Sign In',
        onLinkPress: () => router.push('/(auth)/login'),
    },
});

export const forgotPasswordStep3Config = (
    onResetPassword: (data: any) => void,
    loading?: boolean
): AuthScreenConfig => ({
    title: 'Create New Password',
    subtitle: 'Create your new password to login',

    fields: [
        {
            name: 'newPassword',
            type: 'password',
            placeholder: 'Введіть новий пароль',
            validation: {
                required: true,
                minLength: 6,
            },
        },
        {
            name: 'confirmPassword',
            type: 'password',
            placeholder: 'Підтвердіть новий пароль',
            validation: {
                required: true,
                custom: (value: string, formData?: Record<string, string>) => {
                    if (formData && value !== formData.newPassword) {
                        return 'Паролі не співпадають';
                    }
                    return null;
                },
            },
        },
    ],

    buttons: [
        {
            title: 'Змінити пароль',
            variant: 'fill',
            loading,
            onPress: onResetPassword,
        },
    ],

    bottomLink: {
        text: 'Remember your password?',
        linkText: 'Sign In',
        onLinkPress: () => router.push('/(auth)/login'),
    },
});

