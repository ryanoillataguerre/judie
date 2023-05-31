import rehypeMathjax from 'rehype-mathjax';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import { useColorModeValue, Flex, Table, Td, Thead, useBreakpointValue, Tr } from "@chakra-ui/react"
import { MessageType } from "@judie/data/types/api"
import { UIMessageType } from "@judie/hooks/useChat"
import { CodeBlock } from './CodeBlock';
import { FC, memo } from 'react';
import ReactMarkdown, { Options } from 'react-markdown';
import { AiOutlineUser, AiFillRobot } from 'react-icons/ai';


export const MemoizedReactMarkdown: FC<Options> = memo(
  ReactMarkdown,
  (prevProps, nextProps) => (
      prevProps.children === nextProps.children
  )
);


const MessageRow = ({ message, index }: { 
    message: UIMessageType;
    index: number;
}) => {
  const userBgColor = useColorModeValue("#D9F0ED", "#373f58");
  const leftColumnW = useBreakpointValue({
    base: "20%",
    md: "15%",
  })
  const rightColumnW = useBreakpointValue({
    base: "10%",
    md: "15%",
  })
  const middleColumnW = useBreakpointValue({
    base: "75%",
    md: "60%",
  })
  const leftColumnJustify = useBreakpointValue({
    base: "center",
    md: "flex-end",
  })
  return (
    <Flex style={{
      flexDirection: "row",
      width: "100%",
      ...(message.type === MessageType.USER ? {backgroundColor: userBgColor} : {})
    }}>
      <Flex style={{
        flexDirection: "row",
        alignItems: "flex-start",
        padding: "1rem",
        justifyContent: leftColumnJustify,
        width: leftColumnW,
      }}>
        {message.type === MessageType.USER ? (
          <AiOutlineUser size={20} />
        ) : (
          <AiFillRobot size={20} />
        )}
      </Flex>
    <Flex style={{
      flexDirection: "column",
      gap: "0.5rem",
      padding: "1rem",
      width: middleColumnW
    }}>
      {message.type === MessageType.BOT ? (
        <MemoizedReactMarkdown
          remarkPlugins={[remarkGfm, remarkMath]}
          rehypePlugins={[rehypeMathjax]}
          components={{
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || '');

              return !inline ? (
                <CodeBlock
                  key={Math.random()}
                  language={(match && match[1]) || ''}
                  value={String(children).replace(/\n$/, '')}
                  {...props}
                />
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            },
            table({ children }) {
              return (
                <Table variant="simple">
                  {children}
                </Table>
              )
            },
            tr({ children }) {
              return (
                <Tr>
                  {children}
                </Tr>
              )
            },
            td({ children }) {
              return (
                <Td>
                  {children}
                </Td>
              )
            },
            th({ children }) {
              return (
                <Thead>
                  {children}
                </Thead>
              )
            },

          }}
        >
          {message.readableContent || ""}
        </MemoizedReactMarkdown>
      ) : (
        <Flex>
          {message.readableContent}
        </Flex>
      )}
    </Flex>
    <Flex
      style={{
        width: rightColumnW
      }}
    />
    </Flex>

  )
}
export default MessageRow
