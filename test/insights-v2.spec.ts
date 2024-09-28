import { SeverityLevel } from 'applicationinsightsv2/out/Declarations/Contracts';
import { matchers, object } from 'testdouble';
import { createLogger } from '../src/createLogger';
import { clientV2 } from './client';
import { validate } from './validate';

describe('insights v2', () => {
  it('logs error level', async () => {
    const mock = object(clientV2);

    const logger = createLogger({
      insights: {
        client: mock,
        version: 2,
      },
    });
    logger.error('hello');
    await validate(() =>
      mock.trackTrace(
        matchers.contains({
          severity: SeverityLevel.Error,
        }),
      ),
    );
  });
});
