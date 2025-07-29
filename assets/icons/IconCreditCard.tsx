import React from 'react';
import Svg, { Path } from 'react-native-svg';

const IconCreditCard = ({ size = 13, color = '#171717' }) => (
    <Svg
        width={size}
        height={size}
        viewBox="0 0 13 13"
        fill="none"
    >
        <Path
            d="M1.08331 4.60681H11.9166"
            stroke={color}
            strokeWidth={1.5}
            strokeMiterlimit={10}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <Path
            d="M3.25 8.94019H4.33333"
            stroke={color}
            strokeWidth={1.5}
            strokeMiterlimit={10}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <Path
            d="M5.6875 8.94019H7.85417"
            stroke={color}
            strokeWidth={1.5}
            strokeMiterlimit={10}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <Path
            d="M3.48831 1.89856H9.50623C11.4346 1.89856 11.9166 2.37523 11.9166 4.27648V8.72356C11.9166 10.6248 11.4346 11.1015 9.51165 11.1015H3.48831C1.5654 11.1069 1.08331 10.6302 1.08331 8.72898V4.27648C1.08331 2.37523 1.5654 1.89856 3.48831 1.89856Z"
            stroke={color}
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
);

export default IconCreditCard;