import { KnownSeverityLevel } from 'applicationinsightsv3';
import { matchers, object } from 'testdouble';
import { createLogger } from '../src/createLogger';
import { clientV3 } from './client';
import { validate } from './validate';

describe('insights v3', () => {
  it('logs error level', async () => {
    const mock = object(clientV3);

    const logger = createLogger({
      insights: {
        client: mock,
        version: 3,
      },
    });
    logger.info('hello');
    await validate(() =>
      mock.trackTrace(
        matchers.contains({
          severity: KnownSeverityLevel.Information,
        }),
      ),
    );
  });
});
