import { Analytics } from "@segment/analytics-node";

// instantiation
const analytics = new Analytics({
  writeKey: process.env.SEGMENT_WRITE_KEY || "",
});

export default process.env.NODE_ENV === "production"
  ? analytics
  : {
      track: () => {},
      identify: () => {},
    };