import { pino, type DestinationStream, type Level, type LevelWithSilentOrString, type LoggerOptions, type StreamEntry } from 'pino';
import { PinoPretty } from 'pino-pretty';
import { createTransport } from './createTransport';
import type { PinoApplicationInsightsTransportOptions } from './PinoApplicationInsightsTransport';

export type CreateLoggerOptions = {
  insights: PinoApplicationInsightsTransportOptions;
  pino?: LoggerOptions;
  console?: boolean;
}

export const createLogger = (options: CreateLoggerOptions) => {
  const streams: StreamEntry<LevelWithSilentOrString>[] = [];

  const level = options.pino?.level ?? 'info';

  if (options.console ?? false) {
    const prettyStream: DestinationStream = PinoPretty({
      minimumLevel: level as Level,
      customPrettifiers: {
        time: () => '',
      },
    });
    streams.push({ stream: prettyStream, level });
  }

  const appInsightsTransport = createTransport(options.insights, level);
  streams.push({ stream: appInsightsTransport, level });

  const stream: DestinationStream = pino.multistream(streams);
  return pino(options.pino ?? {}, stream);
};
