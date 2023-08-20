import { transports, format } from 'winston';
import { WinstonModule, utilities as nestWinstonModuleUtilities } from 'nest-winston';
import { LoggerService } from '@nestjs/common';
import { customLogIdFormatter } from './logIdFormatter';
import { USE_JSON_LOGGER, DEBUG } from '@fanout/envs';

export function CustomLoggerFactory(appName: string): LoggerService {
  let consoleFormat: any;

  if (USE_JSON_LOGGER === 'true') {
    consoleFormat = format.combine(
      customLogIdFormatter(),
      format.ms(),
      format.timestamp(),
      format.json(),
    );
  } else {
    consoleFormat = format.combine(
      customLogIdFormatter(),
      format.timestamp(),
      format.ms(),
      nestWinstonModuleUtilities.format.nestLike(appName, {
        colors: true,
        prettyPrint: true,
      }),
    );
  }

  return WinstonModule.createLogger({
    level: DEBUG ? 'debug' : 'info',
    transports: [new transports.Console({ format: consoleFormat })],
  });
}
