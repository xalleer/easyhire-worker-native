
import React from 'react';
import Svg, { Path } from 'react-native-svg';

const IconCompletedOrders = ({ size = 24, color = '#171717' }) => {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <Path
                d="M17.62 9.62H12.37C11.96 9.62 11.62 9.28 11.62 8.87C11.62 8.46 11.96 8.12 12.37 8.12H17.62C18.03 8.12 18.37 8.46 18.37 8.87C18.37 9.28 18.04 9.62 17.62 9.62Z"
                fill={color}
            />
            <Path
                d="M7.12 10.3799C6.93 10.3799 6.74 10.3099 6.59 10.1599L5.84 9.40995C5.55 9.11995 5.55 8.63995 5.84 8.34995C6.13 8.05995 6.61 8.05995 6.9 8.34995L7.12 8.56995L8.84 6.84995C9.13 6.55995 9.61 6.55995 9.9 6.84995C10.19 7.13995 10.19 7.61995 9.9 7.90995L7.65 10.1599C7.51 10.2999 7.32 10.3799 7.12 10.3799Z"
                fill={color}
            />
            <Path
                d="M17.62 16.62H12.37C11.96 16.62 11.62 16.28 11.62 15.87C11.62 15.46 11.96 15.12 12.37 15.12H17.62C18.03 15.12 18.37 15.46 18.37 15.87C18.37 16.28 18.04 16.62 17.62 16.62Z"
                fill={color}
            />
            <Path
                d="M7.12 17.3799C6.93 17.3799 6.74 17.3099 6.59 17.1599L5.84 16.4099C5.55 16.1199 5.55 15.6399 5.84 15.3499C6.13 15.0599 6.61 15.0599 6.9 15.3499L7.12 15.5699L8.84 13.8499C9.13 13.5599 9.61 13.5599 9.9 13.8499C10.19 14.1399 10.19 14.6199 9.9 14.9099L7.65 17.1599C7.51 17.2999 7.32 17.3799 7.12 17.3799Z"
                fill={color}
            />
            <Path
                d="M15 22.75H9C3.57 22.75 1.25 20.43 1.25 15V9C1.25 3.57 3.57 1.25 9 1.25H15C20.43 1.25 22.75 3.57 22.75 9V15C22.75 20.43 20.43 22.75 15 22.75ZM9 2.75C4.39 2.75 2.75 4.39 2.75 9V15C2.75 19.61 4.39 21.25 9 21.25H15C19.61 21.25 21.25 19.61 21.25 15V9C21.25 4.39 19.61 2.75 15 2.75H9Z"
                fill={color}
            />
        </Svg>
    );
};

export default IconCompletedOrders;