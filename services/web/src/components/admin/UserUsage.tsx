import { GET_USER_BY_ID, getUserByIdQuery } from "@judie/data/queries";
import { useQuery } from "react-query";
import { ResponsiveLine } from "@nivo/line";
import { useMemo } from "react";

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
      color: "hsl(351, 70%, 50%)",
      data: newData,
    };
  }, [userData]);

  return (
    <>
      <ResponsiveLine
        data={[lineData]}
        margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
        xScale={{ type: "point" }}
        yScale={{
          type: "linear",
          min: "auto",
          max: "auto",
          stacked: true,
          reverse: false,
        }}
        axisBottom={{
          format: "%b %d",
          legend: "time scale",
          legendOffset: -12,
          tickValues: "every 2 days",
        }}
        axisLeft={{
          legend: "linear scale",
          legendOffset: 12,
        }}
        yFormat=" >-.2f"
        curve="natural"
        axisTop={null}
        axisRight={null}
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
        enablePoints={false}
        pointSize={10}
        pointColor={{ theme: "background" }}
        pointBorderWidth={2}
        pointBorderColor={{ from: "serieColor" }}
        pointLabelYOffset={-12}
        enableCrosshair={false}
        useMesh={true}
        legends={[
          {
            anchor: "bottom-right",
            direction: "column",
            justify: false,
            translateX: 100,
            translateY: 0,
            itemsSpacing: 0,
            itemDirection: "left-to-right",
            itemWidth: 80,
            itemHeight: 20,
            itemOpacity: 0.75,
            symbolSize: 12,
            symbolShape: "circle",
            symbolBorderColor: "rgba(0, 0, 0, .5)",
            effects: [
              {
                on: "hover",
                style: {
                  itemBackground: "rgba(0, 0, 0, .03)",
                  itemOpacity: 1,
                },
              },
            ],
          },
        ]}
      />
    </>
  );
};

export default UserUsage;
