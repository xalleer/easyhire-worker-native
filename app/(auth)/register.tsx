import React, { useState } from 'react';
import AuthScreen from '@/components/AuthScreen';
import { registerStep1Config, registerStep2Config } from '@/config/authConfigs';

export default function RegisterScreen() {
  const [currentStep, setCurrentStep] = useState(1);
  const [step1Data, setStep1Data] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [avatarSource, setAvatarSource] = useState(null);

  const handleStep1Complete = (data: any) => {
    setStep1Data(data);
    setCurrentStep(2);
  };

  const handleRegister = async (step2Data: any) => {
    setLoading(true);
    try {
      const fullData = { ...step1Data, ...step2Data };
      console.log('Registering with:', fullData);
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarPress = () => {
    console.log('Avatar pressed');
  };

  if (currentStep === 1) {
    return (
        <AuthScreen
            config={registerStep1Config(handleStep1Complete, loading)}
            loading={loading}
        />
    );
  }

  return (
      <AuthScreen
          config={registerStep2Config(
              handleRegister,
              handleAvatarPress,
              avatarSource,
              loading
          )}
          loading={loading}
      />
  );
}