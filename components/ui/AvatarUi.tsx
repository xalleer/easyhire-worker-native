import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import IconUpdateImage from "@/assets/icons/IconUpdateImage";

interface AvatarProps {
    uri?: string;
    name?: string;
    size?: number;
    fontSize?: number;
    updateMode?: boolean
}

const AvatarUi: React.FC<AvatarProps> = ({ uri, name = '', size = 40, fontSize, updateMode = false }) => {
    const getInitial = () => {
        return name.trim().charAt(0).toUpperCase();
    };

    return (
        <View style={[styles.container, { width: size, height: size, borderRadius: size / 2,  }]}>
            {updateMode ?
                <View style={styles.updateImage}>
                    <IconUpdateImage />

                </View>

                : null
            }

            {uri ? (
                <Image source={{ uri }} style={[styles.image, { width: size, height: size, borderRadius: size / 2, opacity: updateMode ? 0.5 : 1 }]} />
            ) : (
                <Text style={[styles.initial, { fontSize: fontSize || size * 0.5, opacity: updateMode ? 0 : 1 }]}>{getInitial()}</Text>
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
        position: 'relative',
    },
    updateImage: {
        position: 'absolute',
        top: 40,
        zIndex: 10
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