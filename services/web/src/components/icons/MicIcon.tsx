import React from "react";
import { Icon } from "@chakra-ui/react";

type IconProps = {
  boxSize?: number;
  color?: string;
};

const MicIcon = (props: IconProps) => (
  <Icon
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    stroke={"currentColor"}
    {...props}
  >
    <path
      d="M3.66492 9.31428C3.88644 10.8364 4.64857 12.2278 5.81187 13.2341C6.97518 14.2403 8.46188 14.7941 10 14.7941M10 14.7941C11.5381 14.7941 13.0248 14.2403 14.1881 13.2341C15.3514 12.2278 16.1136 10.8364 16.3351 9.31428M10 14.7941V18M10.0009 2C9.27347 2 8.57581 2.28898 8.06142 2.80336C7.54704 3.31775 7.25806 4.01541 7.25806 4.74286V8.4C7.25806 9.12745 7.54704 9.82511 8.06142 10.3395C8.57581 10.8539 9.27347 11.1429 10.0009 11.1429C10.7284 11.1429 11.426 10.8539 11.9404 10.3395C12.4548 9.82511 12.7438 9.12745 12.7438 8.4V4.74286C12.7438 4.01541 12.4548 3.31775 11.9404 2.80336C11.426 2.28898 10.7284 2 10.0009 2Z"
      stroke="inherit"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Icon>
);

export default MicIcon;
