import { TrackClient, APIClient, RegionUS } from 'customerio-node';

const cioClient = new TrackClient(process.env.CUSTOMERIO_SITE_ID || "", process.env.CUSTOMERIO_API_KEY || "", { region: RegionUS });
const apiClient = new APIClient(process.env.CUSTOMERIO_APP_API_KEY || "", { region: RegionUS });

export {cioClient, apiClient};