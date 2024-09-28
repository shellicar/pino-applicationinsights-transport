import transport from '@shellicar/pino-applicationinsights-transport';
import { createLogger } from '@shellicar/pino-applicationinsights-transport';
import { TelemetryClient } from 'applicationinsights';
console.log(transport);
console.log(createLogger);

const client = new TelemetryClient(process.env.APPLICATIONINSIGHTS_CONNECTION_STRING);
const logger = createLogger({
  console: true,
  insights: {
    version: 3,
    client,
  },
});
logger.info('hello world');
