import type { TelemetryClient as TelemetryClientV2 } from 'applicationinsightsv2';
import type { KnownSeverityLevel, ExceptionTelemetry as ExceptionTelemetryV3, TelemetryClient as TelemetryClientV3, TraceTelemetry as TraceTelemetryV3 } from 'applicationinsightsv3';
import type { SeverityLevel, ExceptionTelemetry as ExceptionTelemetryV2, TraceTelemetry as TraceTelemetryV2 } from 'applicationinsightsv2/out/Declarations/Contracts';
import { levels, type Level, type LevelWithSilentOrString } from 'pino';


const createError = (serializedError: any): { error: Error, properties:  Record<string, any> } => {
  const { message, stack, name, cause, ...properties } = serializedError;

  const error = new Error(message);
  error.stack = stack;
  error.name = name;
  error.cause = cause;

  return { error, properties };
};

export type PinoApplicationInsightsTransportOptions = {
  client: TelemetryClientV2;
  version: 2,
} | {
  client: TelemetryClientV3;
  version: 3,
}

const severityMapV2: Record<LevelWithSilentOrString, SeverityLevel | undefined> = {
  trace: 0,
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
  fatal: 4,
  silent: undefined,
};
const severityMapV3: Record<LevelWithSilentOrString, KnownSeverityLevel | undefined> = {
  trace: 'Verbose' as KnownSeverityLevel,
  debug: 'Verbose' as KnownSeverityLevel,
  info: 'Information' as KnownSeverityLevel,
  warn: 'Warning' as KnownSeverityLevel,
  error: 'Error' as KnownSeverityLevel,
  fatal: 'Critical' as KnownSeverityLevel,
  silent: undefined,
};

export class PinoApplicationInsightsTransport {
  constructor(private readonly options: PinoApplicationInsightsTransportOptions, private readonly defaultLevel: LevelWithSilentOrString) {}

  private mapSeverity(level: any, version: number): SeverityLevel | KnownSeverityLevel | undefined {
    const label: Level = levels.labels[level] as Level;
    return version === 2 ? (severityMapV2[label] ?? severityMapV2[this.defaultLevel]) : (severityMapV3[label] ?? severityMapV3[this.defaultLevel]);
  };

  private trackException(data: any, severity: SeverityLevel | KnownSeverityLevel) {
    const { msg, time, err, ...props } = data;

    const errorDetails = createError(err);

    const telemetry = {
      time: new Date(time),
      exception: errorDetails.error,
      properties: { 
        message: msg, 
        ...errorDetails.properties,
        ...props,
      },
      severity,
    };

    if (this.options.version === 2) {
      this.options.client.trackException(telemetry as ExceptionTelemetryV2);
    } else {
      this.options.client.trackException(telemetry as ExceptionTelemetryV3);
    }
  }

  private trackTrace(data: any, severity: SeverityLevel | KnownSeverityLevel) {
    const { msg, time, ...properties } = data;
    const telemetry = {
      time: new Date(time),
      message: msg,
      severity,
      properties,
    };

    if (this.options.version === 2) {
      this.options.client.trackTrace(telemetry as TraceTelemetryV2);
    } else {
      this.options.client.trackTrace(telemetry as TraceTelemetryV3);
    }
  }

  public processLog(data: any): void {
    const { level, ...rest } = data;
    const severity = this.mapSeverity(level, this.options.version);
    if (severity === undefined) {
      return;
    }

    if (rest.err && level >= levels.values.error) {
      this.trackException(rest, severity);
    } else {
      this.trackTrace(rest, severity);
    }
  }
}

