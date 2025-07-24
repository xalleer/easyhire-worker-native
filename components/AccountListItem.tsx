import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import typography from '@/theme/typography';

type Props = {
    title: string;
    subtitle: string;
    Icon: React.ComponentType<any>;
    onPress: () => void;
};

const AccountListItem = ({ title, subtitle, Icon, onPress }: Props) => (
    <Pressable onPress={onPress}>
        <View style={styles.itemContainer}>
            <Icon />
            <View style={styles.itemTextContainer}>
                <Text style={typography.listTitle}>{title}</Text>
                <Text style={typography.subtitle}>{subtitle}</Text>
            </View>
        </View>
    </Pressable>
);

const styles = StyleSheet.create({
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 8,
        gap: 16,
    },
    itemTextContainer: {
        flex: 1,
        gap: 4,
    },
});

export default AccountListItem;