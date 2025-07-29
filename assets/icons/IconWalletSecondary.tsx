import React from 'react';
import Svg, { Path } from 'react-native-svg';

type Props = {
    size?: number;
    color?: string;
};

const IconWalletSecondary: React.FC<Props> = ({ size = 32, color = '#171717' }) => {
    return (
        <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
            <Path
                d="M29.3333 16V22.6667C29.3333 26.6667 26.6666 29.3334 22.6666 29.3334H9.33329C5.33329 29.3334 2.66663 26.6667 2.66663 22.6667V16C2.66663 12.3734 4.85329 9.84004 8.25329 9.41337C8.59996 9.36004 8.95996 9.33337 9.33329 9.33337H22.6666C23.0133 9.33337 23.3466 9.34669 23.6666 9.40002C27.1066 9.80002 29.3333 12.3467 29.3333 16Z"
                stroke={color}
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M23.6686 9.39996C23.3486 9.34662 23.0152 9.33331 22.6686 9.33331H9.33525C8.96192 9.33331 8.60192 9.35997 8.25525 9.4133C8.44192 9.03997 8.70858 8.69331 9.02858 8.37331L13.3619 4.02663C15.1886 2.21329 18.1486 2.21329 19.9752 4.02663L22.3086 6.38665C23.1619 7.22665 23.6152 8.29329 23.6686 9.39996Z"
                stroke={color}
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M29.3333 16.6666H25.3333C23.8666 16.6666 22.6666 17.8666 22.6666 19.3333C22.6666 20.8 23.8666 22 25.3333 22H29.3333"
                stroke={color}
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
};

export default IconWalletSecondary;