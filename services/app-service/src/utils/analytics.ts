import { Analytics } from "@segment/analytics-node";
import { isProduction } from "./env.js";

export default isProduction()
  ? new Analytics({
      writeKey: process.env.SEGMENT_WRITE_KEY || "",
    })
  : {
      track: () => {},
      identify: () => {},
    };
