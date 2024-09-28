import { Writable } from 'node:stream';
import { PinoApplicationInsightsTransport, type PinoApplicationInsightsTransportOptions } from './PinoApplicationInsightsTransport';
import build from 'pino-abstract-transport';
import type { LevelWithSilentOrString } from 'pino';

export const createTransport = (options: PinoApplicationInsightsTransportOptions, defaultLevel: LevelWithSilentOrString): Writable => {
  const transport = new PinoApplicationInsightsTransport(options, defaultLevel);

  return build(async function (source) {
    for await (let obj of source) {
      try {
        transport.processLog(obj);
      }
      catch (err) {
        console.error(err);
      }
    }
  });
};
