
import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

const IconStar = ({ size = 24, color = '#171717' }) => (
    <Svg width={size} height={size} viewBox="0 0 25 24" fill="none">
        <Path
            d="M21.3356 11.91C22.5056 10.74 22.1256 9.55999 20.4956 9.27999L17.9456 8.85999C17.5156 8.78999 17.0056 8.41 16.8156 8.02L15.4057 5.19999C14.6457 3.66999 13.3956 3.66999 12.6356 5.19999L11.2256 8.02C11.0356 8.41 10.5256 8.77999 10.0956 8.85999L7.54564 9.27999C5.91564 9.54999 5.53564 10.73 6.70564 11.91L8.69563 13.9C9.02563 14.23 9.21563 14.88 9.10563 15.35L8.53563 17.81C8.08563 19.75 9.12564 20.51 10.8356 19.49L13.2256 18.07C13.6556 17.81 14.3756 17.81 14.8056 18.07L17.1956 19.49C18.9056 20.5 19.9456 19.75 19.4956 17.81L18.9256 15.35"
            stroke={color}
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <Path
            d="M8.01562 5H2.01562"
            stroke={color}
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <Path
            d="M5.01562 19H2.01562"
            stroke={color}
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <Path
            d="M3.01562 12H2.01562"
            stroke={color}
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
);

export default IconStar;