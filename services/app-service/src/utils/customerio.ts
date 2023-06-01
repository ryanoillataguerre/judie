import { TrackClient, RegionUS } from 'customerio-node';

const cioClient = new TrackClient(process.env.CUSTOMERIO_SITE_ID || "", process.env.CUSTOMERIO_API_KEY || "", { region: RegionUS });

export default cioClient;