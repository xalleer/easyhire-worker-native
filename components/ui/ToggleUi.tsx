import colors from '@/theme/colors';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, TouchableWithoutFeedback } from 'react-native';

interface Props {
  value?: boolean;
  onValueChange?: (val: boolean) => void;
}

export default function ToggleUi({ value = false, onValueChange }: Props) {
  const [isOn, setIsOn] = useState(value);
  const animation = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(animation, {
      toValue: isOn ? 1 : 0,
      duration: 250,
      useNativeDriver: false,
    }).start();
  }, [isOn]);

  useEffect(() => {
    setIsOn(value);
  }, [value]);

  const toggleSwitch = () => {
    const newVal = !isOn;
    setIsOn(newVal);
    if (onValueChange) onValueChange(newVal);
  };

  const translateX = animation.interpolate({
  inputRange: [0, 1],
  outputRange: [2, 30],
});

  const trackColor = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ['#E5E5EA', '#E5E5EA'], 
  });

  return (
    <TouchableWithoutFeedback onPress={toggleSwitch}>
      <Animated.View style={[styles.track, { backgroundColor: trackColor }]}>
        <Animated.View style={[styles.thumb, { transform: [{ translateX }] }]} />
      </Animated.View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  track: {
    width: 60,
    height: 31,
    borderRadius: 31 / 2,
    justifyContent: 'center',
  },
  thumb: {
    width: 27,
    height: 27,
    borderRadius: 27 / 2,
    backgroundColor: colors.chipPrimary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 1.5,
    elevation: 2,
  },
});