import {
  HiOutlineClipboardList,
  HiOutlineClipboardCheck,
} from "react-icons/hi";
import { BsDownload } from "react-icons/bs";
import { FC, memo, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import {
  generateRandomString,
  programmingLanguages,
} from "@judie/utils/markdown";
import { useBreakpointValue, Button, Flex, Text } from "@chakra-ui/react";

interface Props {
  language: string;
  value: string;
}

const CodeBlock: FC<Props> = memo(({ language, value }) => {
  const [isCopied, setIsCopied] = useState<Boolean>(false);

  const copyToClipboard = () => {
    if (!navigator.clipboard || !navigator.clipboard.writeText) {
      return;
    }

    navigator.clipboard.writeText(value).then(() => {
      setIsCopied(true);

      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    });
  };
  const downloadAsFile = () => {
    const fileExtension = programmingLanguages[language] || ".file";
    const suggestedFileName = `file-${generateRandomString(
      3,
      true
    )}${fileExtension}`;
    const fileName = window.prompt("Enter file name" || "", suggestedFileName);

    if (!fileName) {
      // user pressed cancel on prompt
      return;
    }

    const blob = new Blob([value], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = fileName;
    link.href = url;
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  const displayCopyCode = useBreakpointValue({
    base: false,
    md: true,
  });
  return (
    <Flex
      style={{
        position: "relative",
        fontSize: "1rem",
        flexDirection: "column",
      }}
    >
      <Flex
        style={{
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0.5rem 1rem",
          border: "1px solid #565555",
          borderRadius: "0.5rem 0.5rem 0 0",
          borderBottom: "none",
          marginBottom: "-10px",
          width: "100%",
        }}
      >
        <Text
          style={{
            fontSize: "0.75rem",
            fontWeight: "bold",
          }}
        >
          {language}
        </Text>

        {displayCopyCode && (
          <Flex
            style={{
              alignItems: "center",
            }}
          >
            <Button variant="ghost" onClick={copyToClipboard}>
              {isCopied ? (
                <HiOutlineClipboardCheck
                  size={18}
                  style={{
                    marginRight: "0.2rem",
                  }}
                />
              ) : (
                <HiOutlineClipboardList
                  size={18}
                  style={{
                    marginRight: "0.2rem",
                  }}
                />
              )}
              {isCopied ? "Copied!" : "Copy"}
            </Button>
            <Button variant="ghost" onClick={downloadAsFile}>
              <BsDownload size={18} />
            </Button>
          </Flex>
        )}
      </Flex>

      <SyntaxHighlighter
        language={language}
        style={oneDark}
        customStyle={{ maxWidth: "100%" }}
      >
        {value}
      </SyntaxHighlighter>
    </Flex>
  );
});

CodeBlock.displayName = "CodeBlock";

export default CodeBlock;
