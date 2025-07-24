import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

export default function IconBackHeader() {
    return (
        <Svg width={42} height={42} viewBox="0 0 42 42" fill="none">
            <Circle cx={21} cy={21} r={20.5} fill="white" stroke="#E9F1FF" />
            <Path
                d="M23.9167 26.8333L18.0833 21L23.9167 15.1667"
                stroke="#002055"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
}