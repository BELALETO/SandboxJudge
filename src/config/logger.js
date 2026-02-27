import winston from 'winston';

const { combine, timestamp, printf, colorize, json, errors, prettyPrint } =
  winston.format;

const customLevels = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4
  },
  colors: {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'blue'
  }
};

winston.addColors(customLevels.colors);

const consoleFormat = printf(({ level, message, timestamp, stack }) => {
  return stack
    ? `[${timestamp}] ${level}: ${stack}`
    : `[${timestamp}] ${level}: ${message}`;
});

export const appLogger = winston.createLogger({
  levels: customLevels.levels,
  level: 'debug',
  transports: [
    new winston.transports.Console({
      format: combine(
        errors({ stack: true }),
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        colorize({ all: true }),
        consoleFormat
      )
    }),
    new winston.transports.File({
      filename: './logs/error.log',
      level: 'error',
      format: combine(
        errors({ stack: true }),
        timestamp(),
        json(),
        prettyPrint()
      )
    }),
    new winston.transports.File({
      filename: './logs/combined.log',
      level: 'debug',
      format: combine(
        errors({ stack: true }),
        timestamp(),
        json(),
        prettyPrint(),
        winston.format((info) => (info.level === 'error' ? false : info))() // skip errors
      )
    })
  ]
});
