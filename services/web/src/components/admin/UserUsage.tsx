import AutoSizer from "react-virtualized-auto-sizer";
import moment from "moment";
import { GET_USER_BY_ID, getUserByIdQuery } from "@judie/data/queries";
import { useQuery } from "react-query";
import { Line, ResponsiveLine } from "@nivo/line";
import { useMemo } from "react";
import { Flex, Tag, useTheme, useToken } from "@chakra-ui/react";

const UserUsage = ({ id }: { id: string }) => {
  const { data: userData } = useQuery({
    queryKey: [GET_USER_BY_ID, id],
    queryFn: () => getUserByIdQuery(id),
    enabled: !!id,
  });

  const lineData = useMemo(() => {
    const newData: { x: string; y: number }[] = [];
    const dayToMessages: { [key: string]: number } = {};
    userData?.chats?.map((chat) => {
      chat.messages?.map((message) => {
        const date = new Date(message.createdAt);
        const day = date.toLocaleDateString();
        if (dayToMessages[day]) {
          dayToMessages[day] += 1;
        } else {
          dayToMessages[day] = 1;
        }
      });
    }, []);
    Object.keys(dayToMessages).map((key) => {
      newData.push({ x: key, y: dayToMessages[key] });
    });
    return {
      id: "usage",
      color: "blue",
      data: newData,
    };
  }, [userData]);

  const color = useToken("colors", "blue.400");

  return (
    <Flex width={"100%"} height={"400px"}>
      <AutoSizer style={{ width: "100%" }}>
        {({ height, width }: { height: number; width: number }) => (
          <Line
            height={height}
            width={width}
            colors={[color]}
            theme={{
              // TODO: Color mode values
              axis: {
                domain: {
                  line: {
                    stroke: "#BABABA",
                  },
                },
                legend: {
                  text: {
                    fill: "#BABABA",
                  },
                },
                ticks: {
                  line: {
                    stroke: "#BABABA",
                    strokeWidth: 1,
                  },
                  text: {
                    fill: "#BABABA",
                  },
                },
              },
            }}
            useMesh={true}
            data={[lineData]}
            margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
            xScale={{ type: "point" }}
            yScale={{
              type: "linear",
              min: 0,
              // max: "auto",
              stacked: true,
              reverse: false,
            }}
            axisBottom={{
              format: function (value) {
                return moment(value).format("MM/DD");
              },
            }}
            axisLeft={{
              legend: "Messages",
              legendOffset: -40,
              tickValues: "every 2 days",
            }}
            // yFormat=" >-.2f"
            curve="natural"
            axisTop={null}
            axisRight={null}
            tooltip={({ point }) => (
              <Tag colorScheme="cyan">
                {Math.round(Number(point.data.yFormatted))} messages on{" "}
                {moment(point.data.x).format("MM/DD")}
              </Tag>
            )}
            // axisBottom={{
            //   tickSize: 5,
            //   tickPadding: 5,
            //   tickRotation: 0,
            //   legend: "transportation",
            //   legendOffset: 36,
            //   legendPosition: "middle",
            // }}
            // axisLeft={{
            //   tickSize: 5,
            //   tickPadding: 5,
            //   tickRotation: 0,
            //   legend: "count",
            //   legendOffset: -40,
            //   legendPosition: "middle",
            // }}
            enableGridX={false}
            enableGridY={false}
            // enablePoints={false}
            // pointSize={10}
            // pointColor={{ theme: "background" }}
            // pointBorderWidth={2}
            // pointBorderColor={{ from: "serieColor" }}
            pointLabelYOffset={-12}
            enableCrosshair={false}
          />
        )}
      </AutoSizer>
    </Flex>
  );
};

export default UserUsage;
