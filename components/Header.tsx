import colors from '@/theme/colors';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import IconBackHeader from "@/assets/icons/IconBackHeader";

interface HeaderProps {
  title: string;
  showBack?: boolean;
}

export default function Header({ title, showBack = true }: HeaderProps) {
  const navigation = useNavigation();

  return (
    <View style={styles.headerContainer}>
      <View style={styles.side}>
        {showBack && (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <IconBackHeader/>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.center}>
        <Text style={styles.title}>{title}</Text>
      </View>

      <View style={styles.side} />
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingLeft: 24,
    paddingRight: 24,
    height: 45
  },
  side: {
    width: 42, 
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 42,
    height: 42,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 18,
    lineHeight: 18,
    fontWeight: '500',
    color: colors.textColor,
    textAlign: 'center',
    fontFamily: 'Montserrat_500Medium',
  },
});