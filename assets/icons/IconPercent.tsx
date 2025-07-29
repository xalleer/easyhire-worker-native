import React from 'react';
import Svg, { Rect, Path } from 'react-native-svg';

type Props = {
    size?: number;
    color?: string;
};

const IconPercent: React.FC<Props> = ({ size = 40, color = '#EE6B8D' }) => {
    return (
        <Svg width={size} height={size} viewBox="0 0 40 40" fill="none">
            <Rect width="40" height="40" fill="white" />
            <Path
                d="M15 3.33337H25C33.3334 3.33337 36.6667 6.66671 36.6667 15V25C36.6667 33.3334 33.3334 36.6667 25 36.6667H15C6.66671 36.6667 3.33337 33.3334 3.33337 25V15C3.33337 6.66671 6.66671 3.33337 15 3.33337Z"
                stroke={color}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M14.2834 25.45L25.1834 14.55"
                stroke={color}
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M14.9666 17.2833C16.0988 17.2833 17.0166 16.3656 17.0166 15.2334C17.0166 14.1012 16.0988 13.1833 14.9666 13.1833C13.8345 13.1833 12.9166 14.1012 12.9166 15.2334C12.9166 16.3656 13.8345 17.2833 14.9666 17.2833Z"
                stroke={color}
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M25.8667 26.8167C26.9989 26.8167 27.9168 25.8988 27.9168 24.7666C27.9168 23.6345 26.9989 22.7167 25.8667 22.7167C24.7346 22.7167 23.8168 23.6345 23.8168 24.7666C23.8168 25.8988 24.7346 26.8167 25.8667 26.8167Z"
                stroke={color}
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
};

export default IconPercent;