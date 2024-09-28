import { createLogger } from '@shellicar/pino-applicationinsights-transport';
import { defaultClient, setup } from 'applicationinsights';

// Setup app insights
setup().start();

// Create pino logger with custom settings
const logger = createLogger({
  console: true, // Enable console logging with pretty print
  pino: {
    level: 'debug',
    // Additional pino options can be specified here
  },
  insights: {
    client: defaultClient,
    version: 3,
  },
});

// Log messages with different levels
logger.debug('Debugging information');
logger.info('Informational message');
logger.warn('Warning message');
logger.error('Error message');
logger.fatal('Fatal error');
