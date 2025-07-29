import React from 'react';
import Svg, { Path } from 'react-native-svg';

type Props = {
    size?: number;
    color?: string;
};

const IconPayForTask: React.FC<Props> = ({ size = 40, color = '#008F0A' }) => {
    return (
        <Svg width={size} height={size} viewBox="0 0 40 40" fill="none">
            <Path
                d="M11.2167 32.8334C12.5834 31.3667 14.6667 31.4834 15.8667 33.0834L17.55 35.3334C18.9 37.1167 21.0834 37.1167 22.4334 35.3334L24.1167 33.0834C25.3167 31.4834 27.4 31.3667 28.7667 32.8334C31.7334 36 34.15 34.95 34.15 30.5167V11.7334C34.1667 5.01671 32.6 3.33337 26.3 3.33337H13.7C7.40004 3.33337 5.83337 5.01671 5.83337 11.7334V30.5C5.83337 34.95 8.26671 35.9834 11.2167 32.8334Z"
                stroke={color}
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M13.3334 11.6666H26.6667"
                stroke={color}
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M15 18.3334H25"
                stroke={color}
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
};

export default IconPayForTask;