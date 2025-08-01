import React, { useState } from 'react';
import AuthScreen from '@/components/AuthScreen';
import {
    forgotPasswordStep1Config,
    forgotPasswordStep2Config,
    forgotPasswordStep3Config
} from '@/config/authConfigs';

export default function ForgotPasswordScreen() {
    const [currentStep, setCurrentStep] = useState(1);
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSendCode = async (data: any) => {
        setLoading(true);
        try {
            setEmail(data.email);
            console.log('Sending code to:', data.email);
            setCurrentStep(2);
        } catch (error) {
            console.error('Send code error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyCode = async (data: any) => {
        setLoading(true);
        try {
            console.log('Verifying code:', data.code);
            setCurrentStep(3);
        } catch (error) {
            console.error('Verify code error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleResendCode = async () => {
        setLoading(true);
        try {
            console.log('Resending code to:', email);
        } catch (error) {
            console.error('Resend code error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (data: any) => {
        setLoading(true);
        try {
            console.log('Resetting password:', data);
        } catch (error) {
            console.error('Reset password error:', error);
        } finally {
            setLoading(false);
        }
    };

    if (currentStep === 1) {
        return (
            <AuthScreen
                config={forgotPasswordStep1Config(handleSendCode, loading)}
                loading={loading}
            />
        );
    }

    if (currentStep === 2) {
        return (
            <AuthScreen
                config={forgotPasswordStep2Config(
                    handleVerifyCode,
                    handleResendCode,
                    email,
                    loading
                )}
                loading={loading}
            />
        );
    }

    return (
        <AuthScreen
            config={forgotPasswordStep3Config(handleResetPassword, loading)}
            loading={loading}
        />
    );
}