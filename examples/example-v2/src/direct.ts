import { createTransport } from '@shellicar/pino-applicationinsights-transport';
import { pino } from 'pino';
import { TelemetryClient } from 'applicationinsights'; // Import from the installed version

// Initialize Azure Application Insights client
const client = new TelemetryClient(process.env.APPLICATIONINSIGHTS_CONNECTION_STRING);

// Create Application Insights transport stream
const appInsightsTransport = createTransport({
  client, // Pass the TelemetryClient instance
  version: 2, // Specify the version: 2 or 3
}, 'info'); // Default log level

// Create pino logger with multiple streams
const logger = pino({
  level: 'info',
}, pino.multistream([
  { stream: process.stdout, level: 'info' }, // Console stream
  { stream: appInsightsTransport, level: 'info' }, // Application Insights stream
]));

// Log messages
logger.info('Logging to both console and Application Insights');
