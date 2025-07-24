import colors from '@/theme/colors';
import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

interface ButtonUiProps {
  title: string;
  onPress: () => void;
  style?: object;
  textStyle?: object;
  variant?: 'fill' | 'outline' | 'clear';
  disabled?: boolean;
  loading?: boolean;
}

const ButtonUi: React.FC<ButtonUiProps> = ({
  title,
  onPress,
  style,
  textStyle,
  variant = 'fill',
  disabled = false,
  loading = false,
}) => {
  const getButtonStyle = () => {
    switch (variant) {
      case 'outline':
        return [
          styles.base,
          styles.outline,
          disabled && styles.disabled,
        ];
      case 'clear':
        return [
          styles.base,
          styles.clear,
          disabled && styles.disabled,
        ];
      case 'fill':
      default:
        return [
          styles.base,
          styles.fill,
          disabled && styles.disabled,
        ];
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'outline':
        return [styles.text, styles.outlineText, textStyle];
      case 'clear':
        return [styles.text, styles.clearText, textStyle];
      case 'fill':
      default:
        return [styles.text, styles.fillText, textStyle];
    }
  };

  return (
    <Pressable
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator
            size="small"
            color={variant === 'fill' ? colors.white : colors.lightGreen}
          />
        ) : (
          <Text style={getTextStyle()}>{title}</Text>
        )}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
  fill: {
    backgroundColor: colors.lightGreen,
    borderWidth: 0,
  },
  outline: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.lightGreen,
  },
  clear: {
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  disabled: {
    opacity: 0.5,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
  },
  fillText: {
    color: colors.white,
  },
  outlineText: {
    color: colors.lightGreen,
  },
  clearText: {
    color: colors.lightGreen,
  },
});

ButtonUi.displayName = 'CustomButton';

export default ButtonUi;