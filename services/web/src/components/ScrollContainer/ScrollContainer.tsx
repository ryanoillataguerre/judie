import { Box } from "@chakra-ui/react";
import { useCallback, useEffect, useRef, useState } from "react";

const ScrollContainer = ({children}: { children: React.ReactNode}) => {
    const outerDiv = useRef<HTMLDivElement>(null);
    const innerDiv = useRef<HTMLDivElement>(null);
  
    const [prevInnerDivHeight, setPrevInnerDivHeight] = useState<number | null>(null);
  
    // const [showScrollButton, setShowScrollButton] = useState(false);
  
    useEffect(() => {
      const outerDivHeight = outerDiv?.current?.clientHeight || 0;
      const innerDivHeight = innerDiv?.current?.clientHeight || 0;
      const outerDivScrollTop = outerDiv?.current?.scrollTop || 0;
  
      if (
        !prevInnerDivHeight ||
        outerDivScrollTop === prevInnerDivHeight - outerDivHeight
      ) {
        outerDiv?.current?.scrollTo({
          top: innerDivHeight! - outerDivHeight!,
          left: 0,
          behavior: prevInnerDivHeight ? "smooth" : "auto"
        });
      } else {
        // setShowScrollButton(true);
      };
  
      setPrevInnerDivHeight(innerDivHeight);
    }, [children, prevInnerDivHeight, outerDiv, innerDiv]);
  
    const handleScrollButtonClick = useCallback(() => {
      const outerDivHeight = outerDiv?.current?.clientHeight;
      const innerDivHeight = innerDiv?.current?.clientHeight;
  
      outerDiv?.current?.scrollTo({
        top: innerDivHeight! - outerDivHeight!,
        left: 0,
        behavior: "smooth"
      });
  
      // setShowScrollButton(false);
    }, []);
    
    return (
      <Box
        style={{
          position: "relative",
          height: "100%"
        }}
      >
        <Box
          ref={outerDiv}
          style={{
            position: "relative", 
            height: "100%", 
            overflow: "scroll",
           }}
        >
          <Box
            ref={innerDiv}
            style={{
              position: "relative",
            paddingBottom: "10rem"

            }}
          >
            {children}
          </Box>
        </Box>
        {/* {showScrollButton && (
            <Box display={"flex"} w="100%" position={"absolute"} bottom="10rem" justifyContent={"center"} alignItems={"center"}>
                <Button alignSelf={"center"} colorScheme="teal" onClick={handleScrollButtonClick}>Scroll to bottom</Button>
            </Box>
        )} */}
      </Box>
    )
  };

  export default ScrollContainer