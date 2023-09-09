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
  Button,
  Spinner,
  Tooltip,
  Box,
  Avatar,
  Tag,
  TagLabel,
} from "@chakra-ui/react";
import { Message, MessageType } from "@judie/data/types/api";
import { UIMessageType } from "@judie/hooks/useChat";
import CodeBlock from "../MessageRow/CodeBlock";
import { FC, memo, useEffect, useState } from "react";
import ReactMarkdown, { Options } from "react-markdown";
import { AiOutlineUser, AiFillRobot } from "react-icons/ai";
import { HiSpeakerWave, HiPlay } from "react-icons/hi2";
import { useMutation, useQuery } from "react-query";
import { createMessageNarration } from "@judie/data/mutations";
import { GET_CHAT_BY_ID, getChatByIdQuery } from "@judie/data/queries";
import { Howl } from "howler";
import { BsStopFill } from "react-icons/bs";
import useAuth from "@judie/hooks/useAuth";
import { ChatContext } from "@judie/hooks/useChat";
import { useContext } from "react";

export const MemoizedReactMarkdown: FC<Options> = memo(
  ReactMarkdown,
  (prevProps, nextProps) => prevProps.children === nextProps.children
);

const NarrateButton = ({ message }: { message: Message }) => {
  const { refetch } = useQuery({
    queryKey: [GET_CHAT_BY_ID, message.chatId],
    queryFn: () => getChatByIdQuery(message.chatId),
    enabled: false,
  });
  const narrateMessageMutation = useMutation({
    mutationFn: createMessageNarration,
    onSuccess: () => {
      refetch();
    },
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState(
    message.audioFileUrl
      ? new Howl({
          src: message.audioFileUrl,
          html5: true,
        })
      : null
  );

  useEffect(() => {
    if (message.audioFileUrl) {
      setSound(
        new Howl({
          src: message.audioFileUrl,
          html5: true,
        })
      );
    }
  }, [message.audioFileUrl]);
  const playAudioFile = () => {
    setIsPlaying(true);

    if (!sound) {
      setSound(() => {
        if (message.audioFileUrl) {
          return new Howl({
            src: message.audioFileUrl,
            html5: true,
          });
        }
        return null;
      });
    }
    if (sound) {
      sound.play();
      sound.on("end", () => {
        setIsPlaying(false);
      });
    }
  };
  const stopPlaying = () => {
    setIsPlaying(false);
    if (sound) {
      sound.stop();
    }
  };
  const hasAudio = !!message.audioFileUrl;
  return (
    <Button
      variant={"ghost"}
      size={"sm"}
      pr={{ base: 2, md: "12px" }}
      onClick={() =>
        hasAudio
          ? isPlaying
            ? stopPlaying()
            : playAudioFile()
          : narrateMessageMutation.mutate({
              messageId: message.id,
            })
      }
      position="relative"
      type="button"
    >
      {narrateMessageMutation.isLoading ? (
        <Spinner
          aria-label="Creating narration..."
          colorScheme="white"
          size={"sm"}
        />
      ) : hasAudio ? (
        isPlaying ? (
          <Tooltip label={"Stop Narration"} placement={"top"}>
            <Box>
              <BsStopFill size={20} />
            </Box>
          </Tooltip>
        ) : (
          <Tooltip label={"Play Narration"} placement={"top"}>
            <Box>
              <HiPlay size={20} />
            </Box>
          </Tooltip>
        )
      ) : (
        <Tooltip label={"Create Narration"} placement={"top"}>
          <Box>
            <HiSpeakerWave size={20} />
          </Box>
        </Tooltip>
      )}
    </Button>
  );
};

const MessageRow = ({
  message,
  beingStreamed,
}: {
  message: UIMessageType;
  beingStreamed?: boolean;
}) => {
  const { userData } = useAuth();
  const chat = useContext(ChatContext);
  const subject = chat.chat?.subject;
  const useJudieLogo = useColorModeValue("/logo.svg", "/logo_dark.svg");

  return (
    <Flex
      flexDirection={message.type === MessageType.USER ? "row-reverse" : "row"}
      alignSelf={message.type === MessageType.USER ? "flex-end" : "flex-start"}
      height={"fit-content"}
      width={"auto"}
      maxW={
        message.type === MessageType.USER
          ? { base: "80%", md: "80%", lg: "85%", xl: "80%" }
          : { base: "100%", md: "95%", lg: "85%", xl: "80%" }
      }
      mb={3}
      fontSize={"14px"}
      lineHeight={"20px"}
    >
      <Flex
        flexDirection={"row"}
        alignItems={
          message.type === MessageType.USER ? "flex-end" : "flex-start"
        }
        justifyContent={
          message.type === MessageType.USER ? "flex-start" : "flex-end"
        }
        paddingLeft={{
          base: message.type === MessageType.USER ? "9px" : "4px",
          md: message.type === MessageType.USER ? "9px" : "25px",
          lg: message.type === MessageType.USER ? "9px" : "50px",
        }}
        paddingRight={{
          base: message.type === MessageType.USER ? "4px" : "9px",
          md: message.type === MessageType.USER ? "25px" : "9px",
          lg: message.type === MessageType.USER ? "50px" : "9px",
        }}
        paddingTop={message.type === MessageType.USER ? "" : 6}
        paddingBottom={message.type === MessageType.USER ? 1 : 0}
      >
        <Box
          border={message.type === MessageType.USER ? "none" : "1px solid"}
          borderRadius={"20px"}
          borderColor={"rgba(0, 0, 0, 0.30)"}
          padding={message.type === MessageType.USER ? "0px" : "6px"}
          sx={
            message.type === MessageType.USER
              ? {
                  img: {
                    margin: "0px",
                  },
                }
              : {
                  img: {
                    margin: "px",
                  },
                }
          }
        >
          {message.type === MessageType.USER ? (
            <Avatar
              size={"sm"}
              name={`${userData?.firstName} ${userData?.lastName}`}
              color={"#FFF"}
              bg="purple.600"
            />
          ) : (
            <Avatar size={"xs"} name="Judie" src={useJudieLogo} />
          )}
        </Box>
      </Flex>
      <Flex
        style={{
          flexDirection: "column",
          padding: "10px",
        }}
        minW={"120px"}
        flexGrow={1}
        bg={
          message.type === MessageType.USER
            ? "brand.secondary"
            : "brand.primary"
        }
        borderRadius={"10px"}
        gap={4}
        color={"white"}
        sx={{
          li: {
            listStylePosition: "inside",
            paddingLeft: "0.5rem",
            paddingBottom: "0.5rem",
            p: {
              display: "inline",
            },
          },
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
                    key={Math.random()}
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
            }}
          >
            {message.readableContent || ""}
          </MemoizedReactMarkdown>
        ) : (
          <Flex>{message.readableContent}</Flex>
        )}
      </Flex>
      {message.type === MessageType.BOT && !beingStreamed ? (
        <Flex
          style={{
            flexDirection: "row",
            alignItems: "flex-start",
            justifyContent: "flex-start",
          }}
          pt={6}
          pl={"0px"}
          pr={"0px"}
        >
          <NarrateButton message={message as Message} />
        </Flex>
      ) : null}
    </Flex>
  );
};
export default MessageRow;
