
import React from 'react';
import Svg, { Rect } from 'react-native-svg';

type IconStatusProps = {
    color?: string;
};

const IconStatus: React.FC<IconStatusProps> = ({ color = '#008F0A' }) => (
    <Svg width="5" height="6" viewBox="0 0 5 6" fill="none">
        <Rect y="0.5" width="5" height="5" rx="2.5" fill={color} />
    </Svg>
);

export default IconStatus;