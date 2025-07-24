
import React from 'react';
import Svg, { Path } from 'react-native-svg';

const IconProfile = ({ size = 24, color = '#171717' }) => (
    <Svg width={size} height={size} viewBox="0 0 25 24" fill="none">
        <Path
            d="M12.5 12C15.2614 12 17.5 9.76142 17.5 7C17.5 4.23858 15.2614 2 12.5 2C9.73858 2 7.5 4.23858 7.5 7C7.5 9.76142 9.73858 12 12.5 12Z"
            fill={color}
        />
        <Path
            d="M12.5 14.5C7.49 14.5 3.41 17.86 3.41 22C3.41 22.28 3.63 22.5 3.91 22.5H21.09C21.37 22.5 21.59 22.28 21.59 22C21.59 17.86 17.51 14.5 12.5 14.5Z"
            fill={color}
        />
    </Svg>
);

export default IconProfile;