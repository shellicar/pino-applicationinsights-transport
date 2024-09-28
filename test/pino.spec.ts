import { pino } from 'pino';
import { PinoPretty } from 'pino-pretty';

describe('default pino', () => {
  it('info', () => {
    const logger = pino({});
    logger.info('hello world');
  });

  it('logs error', () => {
    const logger = pino(PinoPretty({
      customPrettifiers: {
        time: () => '',
      },
    }));
    const err = new Error('oh noes');
    logger.error(err);
  });

  it('logs error with message', () => {
    const logger = pino(PinoPretty({
      customPrettifiers: {
        time: () => '',
      },
    }));
    const err = new Error('oh noes');
    logger.error(err, 'oh dear');
  });
});
