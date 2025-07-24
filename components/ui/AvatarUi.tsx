import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';

interface AvatarProps {
    uri?: string;
    name?: string;
    size?: number;
    fontSize?: number;
}

const AvatarUi: React.FC<AvatarProps> = ({ uri, name = '', size = 40, fontSize }) => {
    const getInitial = () => {
        return name.trim().charAt(0).toUpperCase();
    };

    return (
        <View style={[styles.container, { width: size, height: size, borderRadius: size / 2 }]}>
            {uri ? (
                <Image source={{ uri }} style={[styles.image, { width: size, height: size, borderRadius: size / 2 }]} />
            ) : (
                <Text style={[styles.initial, { fontSize: fontSize || size * 0.5 }]}>{getInitial()}</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#ccc',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    image: {
        resizeMode: 'cover',
    },
    initial: {
        color: '#fff',
        fontWeight: '600',
    },
});

export default AvatarUi;