import rehypeMathjax from "rehype-mathjax";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import {
  useColorModeValue,
  Flex,
  Table,
  Td,
  Thead,
  Tr,
  Code,
  Box,
  Text,
} from "@chakra-ui/react";
import { MessageType } from "@judie/data/types/api";
import { ChatContext, UIMessageType } from "@judie/hooks/useChat";
import CodeBlock from "./CodeBlock";
import { FC, memo, useContext } from "react";
import ReactMarkdown, { Options } from "react-markdown";
import { AiOutlineUser, AiFillRobot } from "react-icons/ai";

export const MemoizedReactMarkdown: FC<Options> = memo(
  ReactMarkdown,
  (prevProps, nextProps) => prevProps.className === nextProps.className
);

const MessageRow = ({
  message,
  isStreaming,
}: {
  message: UIMessageType;
  isStreaming?: boolean;
}) => {
  const userBgColor = useColorModeValue("#D9F0ED", "#373f58");
  return (
    <Flex
      style={{
        flexDirection: "row",
        width: "100%",
        minWidth: "100%",
        ...(message.type === MessageType.USER
          ? { backgroundColor: userBgColor }
          : {}),
      }}
    >
      <Flex
        style={{
          flexDirection: "row",
          alignItems: "flex-start",
          padding: "1rem",
          justifyContent: "flex-end",
          width: "15%",
        }}
      >
        {message.type === MessageType.USER ? (
          <AiOutlineUser size={20} />
        ) : (
          <AiFillRobot size={20} />
        )}
      </Flex>
      <Flex
        style={{
          flexDirection: "column",
          gap: "0.5rem",
          padding: "1rem",
          width: "60%",
        }}
      >
        {message.type === MessageType.BOT ? (
          <MemoizedReactMarkdown
            remarkPlugins={[remarkGfm, remarkMath]}
            rehypePlugins={[rehypeMathjax]}
            components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || "");
                return !inline ? (
                  <CodeBlock
                    key={message?.createdAt?.toString() || ""}
                    language={(match && match[1]) || ""}
                    value={String(children).replace(/\n$/, "")}
                    {...props}
                  />
                ) : (
                  <Code className={className} {...props}>
                    {children}
                  </Code>
                );
              },
              table({ children }) {
                return <Table variant="simple">{children}</Table>;
              },
              tr({ children }) {
                return <Tr>{children}</Tr>;
              },
              td({ children }) {
                return <Td>{children}</Td>;
              },
              th({ children }) {
                return <Thead>{children}</Thead>;
              },
              // p({ children }) {
              //   return (
              //     <Text as="span">
              //       {children}
              //       {isStreaming ? (
              //         <Box
              //           __css={{
              //             "@keyframes cursor-blink": {
              //               "0%": { opacity: 0 },
              //               "100%": { opacity: 1 },
              //             },
              //             width: "5px",
              //             height: "20px",
              //             marginBottom: "-0.2rem",
              //             background: "white",
              //             display: "inline-block",
              //             animation: "cursor-blink 1.5s steps(2) infinite",
              //           }}
              //         ></Box>
              //       ) : null}
              //     </Text>
              //   );
              // },
            }}
          >
            {message.readableContent || ""}
          </MemoizedReactMarkdown>
        ) : (
          <Flex>{message.readableContent}</Flex>
        )}
      </Flex>
      <Flex
        style={{
          width: "15%",
        }}
      />
    </Flex>
  );
};
export default MessageRow;
