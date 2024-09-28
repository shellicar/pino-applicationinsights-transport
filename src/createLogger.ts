import { type DestinationStream, type Level, type LevelWithSilentOrString, type LoggerOptions, type StreamEntry, pino } from 'pino';
import { PinoPretty } from 'pino-pretty';
import type { PinoApplicationInsightsTransportOptions } from './PinoApplicationInsightsTransport';
import { createTransport } from './createTransport';

export type CreateLoggerOptions = {
  insights: PinoApplicationInsightsTransportOptions;
  pino?: LoggerOptions;
  console?: boolean;
};

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
