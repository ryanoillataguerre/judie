import React from "react";
import { Icon } from "@chakra-ui/react";

type IconProps = {
  boxSize?: number;
  color?: string;
};

const SendIcon = (props: IconProps) => (
  <Icon
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    stroke={"currentcolor"}
    {...props}
  >
    <path
      d="M2.56322 7.8854C2.02122 8.1129 1.6848 8.5179 1.67972 9.09123C1.67622 9.49206 1.94672 10.0304 2.48872 10.2504C2.71197 10.3412 5.84655 10.7629 5.84655 10.7629C5.84655 10.7629 6.67622 13.3854 6.97522 14.3071C7.0618 14.5737 7.11114 14.7046 7.30114 14.8787C7.62347 15.1737 8.16839 15.0813 8.40405 14.8446C9.02755 14.2196 10.0131 13.2554 10.0131 13.2554L10.4278 13.5929C10.4278 13.5929 12.2696 15.0621 13.2763 15.7537C13.8691 16.1612 14.2805 16.5862 14.9476 16.5887C15.2875 16.5904 15.8326 16.4212 16.1929 16.0087C16.431 15.7362 16.5837 15.3004 16.6428 14.9096C16.7771 14.0221 18.3531 4.42541 18.3464 4.08957C18.3357 3.55374 17.885 3.25207 17.5103 3.2554C17.275 3.2579 17.0811 3.32624 16.6496 3.45791C13.3117 4.47708 2.7843 7.7929 2.56322 7.8854ZM15.0131 5.7554C15.0131 5.7554 10.6147 9.58374 8.85714 11.3454C8.29405 11.9096 8.2543 12.8779 8.2543 12.8779L7.34581 9.97123L15.0131 5.7554Z"
      fill="black"
    />
  </Icon>
);

export default SendIcon;