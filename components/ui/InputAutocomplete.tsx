import colors from '@/theme/colors';
import React, { useState } from 'react';
import {
    View,
    TextInput,
    FlatList,
    Text,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';

interface InputAutocompleteProps {
    data: string[];
    placeholder?: string;
    style?: object;
    inputStyle?: object;
    listStyle?: object;
    listItemStyle?: object;
    textStyle?: object;
    value?: string;
    onChangeText?: (text: string) => void;
    onSelect?: (item: string) => void;
    onFocus?: () => void;
    onBlur?: () => void;
}

const InputAutocomplete: React.FC<InputAutocompleteProps> = ({
                                                                 data,
                                                                 placeholder = 'Type to search...',
                                                                 style,
                                                                 inputStyle,
                                                                 listStyle,
                                                                 listItemStyle,
                                                                 textStyle,
                                                                 value = '',
                                                                 onChangeText,
                                                                 onSelect,
                                                                 onFocus,
                                                                 onBlur
                                                             }) => {
    const [filteredData, setFilteredData] = useState<string[]>([]);
    const [showList, setShowList] = useState(false);

    const handleChange = (text: string) => {
        onChangeText?.(text);
        if (text.length === 0) {
            setFilteredData([]);
            setShowList(false);
            return;
        }

        const filtered = data.filter(item =>
            item.toLowerCase().includes(text.toLowerCase())
        );
        setFilteredData(filtered);
        setShowList(filtered.length > 0);
    };

    const handleSelect = (item: string) => {
        onSelect?.(item);
        setFilteredData([]);
        setShowList(false);
    };

    const handleFocus = () => {
        onFocus?.();
        if (value && filteredData.length > 0) {
            setShowList(true);
        }
    };

    const handleBlur = () => {
        setTimeout(() => {
            setShowList(false);
            onBlur?.();
        }, 150);
    };

    return (
        <View style={[styles.container, style]}>
            <TextInput
                style={[styles.input, inputStyle]}
                placeholder={placeholder}
                placeholderTextColor={colors.chipSecondary}
                value={value}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onChangeText={handleChange}
            />
            {showList && filteredData.length > 0 && (
                <FlatList
                    style={[styles.list, listStyle]}
                    data={filteredData}
                    keyExtractor={item => item}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            onPress={() => handleSelect(item)}
                            style={[styles.listItem, listItemStyle]}
                        >
                            <Text style={[styles.text, textStyle]}>{item}</Text>
                        </TouchableOpacity>
                    )}
                    keyboardShouldPersistTaps="handled"
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        zIndex: 1,
    },
    input: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        height: 56,
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.borderColor,
        fontSize: 16,
        color: colors.black,
    },
    list: {
        backgroundColor: colors.white,
        borderColor: colors.lightGreen,
        maxHeight: 150,
    },
    listItem: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomColor: colors.borderColor,
    },
    text: {
        fontSize: 16,
        color: colors.black,
    },
});

InputAutocomplete.displayName = 'InputAutocomplete';

export default InputAutocomplete;