import { createLogger } from '../src/createLogger';
import { object, verify, matchers } from 'testdouble';
import { validate } from './validate';
import { clientV2 } from './client';

class CustomError extends Error {
  constructor(message: string, public readonly extensions: any) {
    super(message);
  }
}

describe('helpers', () => {
  

  it('trace works', async () => {
    const mock = object(clientV2);
    const logger = createLogger({ insights: { client: mock, version: 2 } });
    logger.info('hello world');

    await validate(() => mock.trackTrace(matchers.contains({
      message: 'hello world',
    })));
  });

  it('error works', async () => {
    const mock = object(clientV2);
    const logger = createLogger({ insights: { client: mock, version: 2 } });
    const err = new Error('error works #1');
    logger.error(err);
    await validate(() => mock.trackException(matchers.contains({
      exception: matchers.contains({
        ...err,
      }),
    })));
  });

  it('error works #2', async () => {
    const mock = object(clientV2);
    const logger = createLogger({ insights: { client: mock, version: 2 } });
    const err = new Error('error works #2');
    logger.error('test message #2', err);
    await validate(() => mock.trackTrace(matchers.contains({
      message: 'test message #2',
    })));
  });

  it('error works #3', async () => {
    const mock = object(clientV2);
    const logger = createLogger({ insights: { client: mock, version: 2 } });    const err = new Error('error works #3');
    logger.error(err, 'test message #3');

    await new Promise(process.nextTick);
    await new Promise(process.nextTick);
    verify(mock.trackException(matchers.contains({
      exception: matchers.contains({
        ...err,
      }),
    })));
  });

  it('error works #4', async () => {
    const mock = object(clientV2);
    const logger = createLogger({ insights: { client: mock, version: 2 } });
    const err = new CustomError('error works #4', {
      test: 'hi',
    });
    logger.error(err, 'test message #4');

    await validate(() => mock.trackException(matchers.contains({
      exception: matchers.contains({
        message: err.message,
        stack: err.stack,
      }),
      properties: matchers.contains({
        extensions: err.extensions,
      }),
    })));
  });

  it('null extensions', async () => {
    const mock = object(clientV2);
    const logger = createLogger({ insights: { client: mock, version: 2 } });
    const err = new CustomError('error works #4', Object.create(null));
    logger.error(err, 'test message #4');

    await validate(() => mock.trackException(matchers.contains({
      exception: matchers.contains({
        message: err.message,
        stack: err.stack,
      }),
      properties: matchers.contains({
        extensions: err.extensions,
      }),
    })));
  });
});
