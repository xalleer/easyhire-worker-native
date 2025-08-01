import React, { useState } from 'react';
import AuthScreen from '@/components/AuthScreen';
import { loginScreenConfig } from '@/config/authConfigs';
import { useLogin } from '@/hooks/useLogin';

export default function LoginScreen() {
  const { login, loading } = useLogin();
  const [isEmailSelected, setIsEmailSelected] = useState(false);

  const handleLogin = (data: any) => {
    if (isEmailSelected) {
      login({ email: data.loginField, password: data.password });
    } else {
      login({ phone: data.loginField, password: data.password });
    }
  };

  const handleToggle = (val: boolean) => {
    setIsEmailSelected(val);
  };

  return (
      <>

        <AuthScreen
            config={loginScreenConfig(isEmailSelected, handleToggle, handleLogin, loading)}
            loading={loading}
        />
      </>

  );
}