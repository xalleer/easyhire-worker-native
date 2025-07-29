import React from 'react';
import Svg, { Path } from 'react-native-svg';

type Props = {
    size?: number;
    color?: string;
};

const IconDeposit: React.FC<Props> = ({ size = 40, color = '#008F0A' }) => {
    return (
        <Svg width={size} height={size} viewBox="0 0 40 40" fill="none">
            <Path
                d="M3.33337 14.1666H24.1667"
                stroke={color}
                strokeWidth={1.5}
                strokeMiterlimit={10}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M10 27.5H13.3333"
                stroke={color}
                strokeWidth={1.5}
                strokeMiterlimit={10}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M17.5 27.5H24.1667"
                stroke={color}
                strokeWidth={1.5}
                strokeMiterlimit={10}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M36.6667 23.3834V26.85C36.6667 32.7 35.1834 34.1667 29.2667 34.1667H10.7334C4.81671 34.1667 3.33337 32.7 3.33337 26.85V13.15C3.33337 7.30004 4.81671 5.83337 10.7334 5.83337H24.1667"
                stroke={color}
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M33.3334 5.83337V15.8334L36.6667 12.5"
                stroke={color}
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M33.3333 15.8333L30 12.5"
                stroke={color}
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
};

export default IconDeposit;