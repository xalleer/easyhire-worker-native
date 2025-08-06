import * as React from "react";
import Svg, { Path } from "react-native-svg";

export default function IconCalendar(props: any) {
    return (
        <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" {...props}>
            <Path
                d="M7 2v2M17 2v2M3 8h18M5 6h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z"
                stroke="#555"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
}