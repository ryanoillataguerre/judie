import { Analytics } from "@segment/analytics-node";

export default process.env.NODE_ENV === "production"
  ? new Analytics({
      writeKey: process.env.SEGMENT_WRITE_KEY || "",
    })
  : {
      track: () => {},
      identify: () => {},
    };
