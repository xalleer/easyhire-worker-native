import { router } from 'expo-router';
import {ActivityIndicator, Button, Pressable, StyleSheet, Text, View} from 'react-native';
import AvatarUi from "@/components/ui/AvatarUi";
import colors from "@/theme/colors";
import typography from "@/theme/typography";

import {listItems} from "@/constants/accountItems";
import AccountListItem from "@/components/AccountListItem";
import {useEffect, useState} from "react";
import {useUserStore} from "@/store/userStore";
import {getMeApi} from "@/api/user";

export default function EditProfile() {


    return (
        <View style={styles.container}>
           <Text>Edit Profile</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 32,
        paddingHorizontal: 24,
        backgroundColor: colors.background
    },
    list: {
        gap: 16,
        marginTop: 50,
        width: '100%',
    }

});