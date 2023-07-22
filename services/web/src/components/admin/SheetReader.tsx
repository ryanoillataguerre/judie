import { Flex, Text } from "@chakra-ui/react";
import { useState } from "react";
import { useCSVReader } from "react-papaparse";

const SheetReader = <T,>({
  onFileChange,
}: {
  onFileChange: (rows: T[]) => void;
}) => {
  const { CSVReader } = useCSVReader();
  return (
    <CSVReader
      onUploadAccepted={(results: any) => {
        console.log("---------------------------");
        console.log(results);
        console.log("---------------------------");
      }}
      onUploadRejected={(error: any) => {
        console.log("error---------------------------");
        console.log(error);
        console.log("error---------------------------");
      }}

      //   onDragOver={(event: DragEvent) => {
      //     event.preventDefault();
      //   }}
      //   onDragLeave={(event: DragEvent) => {
      //     event.preventDefault();
      //   }}
    >
      {({
        getRootProps,
        acceptedFile,
        ProgressBar,
        getRemoveFileProps,
        Remove,
      }: any) => (
        <>
          <Flex
            width={"100%"}
            height={"100%"}
            borderWidth={"2px"}
            borderColor={"gray.500"}
            borderStyle={"dashed"}
            borderRadius={"md"}
            margin={"1rem 0"}
            padding={"1rem"}
            alignItems={"center"}
            justifyContent={"center"}
            {...getRootProps()}
            _hover={{
              cursor: "pointer",
              backgroundColor: "gray.600",
            }}
          >
            {acceptedFile ? (
              <>
                {/* <Flex style={styles.file}>
                  <Flex style={styles.info}>
                    <span style={styles.size}>
                      {formatFileSize(acceptedFile.size)}
                    </span>
                    <span style={styles.name}>{acceptedFile.name}</span>
                  </Flex>
                  <Flex style={styles.progressBar}>
                    <ProgressBar />
                  </Flex>
                  <Flex
                    {...getRemoveFileProps()}
                    style={styles.remove}
                    onMouseOver={(event: Event) => {
                      event.preventDefault();
                      setRemoveHoverColor(REMOVE_HOVER_COLOR_LIGHT);
                    }}
                    onMouseOut={(event: Event) => {
                      event.preventDefault();
                      setRemoveHoverColor(DEFAULT_REMOVE_HOVER_COLOR);
                    }}
                  >
                    <Remove color={removeHoverColor} />
                  </Flex>
                </Flex> */}
              </>
            ) : (
              <Text
                style={{
                  margin: "auto",
                }}
              >
                Click here to upload
              </Text>
            )}
          </Flex>
        </>
      )}
    </CSVReader>
  );
};

export default SheetReader;
