import rehypeMathjax from 'rehype-mathjax';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import { Flex, Table, Td, Thead, useBreakpointValue } from "@chakra-ui/react"
import { MessageType } from "@judie/data/types/api"
import { UIMessageType } from "@judie/hooks/useChat"
import { CodeBlock } from './CodeBlock';
import { FC, memo } from 'react';
import ReactMarkdown, { Options } from 'react-markdown';



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
  const horizontalPadding = useBreakpointValue({
    base: "1rem",
    md: "20%",
  })
  return (
    <Flex style={{
      flexDirection: "column",
      gap: "0.5rem",
      width: "100%",
      padding: `1rem ${horizontalPadding}`,
      ...(index !== 0 ? {borderTop: "0.5px solid #565555"}: {})
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
            }
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
  )
}
export default MessageRow
