import { createLogger } from '@shellicar/pino-applicationinsights-transport';
import { TelemetryClient } from 'applicationinsights';

const client = new TelemetryClient(process.env.APPLICATIONINSIGHTS_CONNECTION_STRING);
const logger = createLogger({
  console: true,
  insights: {
    client,
    version: 2,
  },
});
logger.info('hello world v2');
