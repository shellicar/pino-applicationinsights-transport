import type { Writable } from 'node:stream';
import type { LevelWithSilentOrString } from 'pino';
import build from 'pino-abstract-transport';
import { PinoApplicationInsightsTransport, type PinoApplicationInsightsTransportOptions } from './PinoApplicationInsightsTransport';

export const createTransport = (options: PinoApplicationInsightsTransportOptions, defaultLevel: LevelWithSilentOrString): Writable => {
  const transport = new PinoApplicationInsightsTransport(options, defaultLevel);

  return build(async (source) => {
    for await (const obj of source) {
      try {
        transport.processLog(obj);
      } catch (err) {
        console.error(err);
      }
    }
  });
};
