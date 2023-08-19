import { transports, format } from 'winston';
import { WinstonModule, utilities as nestWinstonModuleUtilities } from 'nest-winston';
import { LoggerService } from '@nestjs/common';

const myFormatter = format((info) => {
  const { level, message } = info;
  console.log(info);
  
  info.requestId = "123";
  return info;
});

export function CustomLoggerFactory(appName: string): LoggerService {
  let consoleFormat: any;

  const DEBUG = process.env.DEBUG;
  const USE_JSON_LOGGER = process.env.USE_JSON_LOGGER;

  if (USE_JSON_LOGGER === 'true') {
    consoleFormat = format.combine(myFormatter(), format.ms(), format.timestamp(), format.json());
  } else {
    consoleFormat = format.combine(
      myFormatter(),
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
