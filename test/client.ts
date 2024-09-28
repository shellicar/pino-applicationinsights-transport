import { TelemetryClient as TelemetryClientV2 } from 'applicationinsightsv2';
import { TelemetryClient as TelemetryClientV3 } from 'applicationinsightsv3';

export const clientV2 = new TelemetryClientV2('InstrumentationKey=00000000-0000-0000-0000-000000000000');
export const clientV3 = new TelemetryClientV3('InstrumentationKey=00000000-0000-0000-0000-000000000000');
