import { matchers, object } from 'testdouble';
import { clientV2 } from './client';
import { createLogger } from '../src/createLogger';
import { validate } from './validate';
import { SeverityLevel } from 'applicationinsightsv2/out/Declarations/Contracts';

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
    await validate(() => mock.trackTrace(matchers.contains({
      severity: SeverityLevel.Error,
    })));
  });
});
