import winston from 'winston';

const { combine, timestamp, printf, colorize, json, errors } = winston.format;

/* ----------------------------
   Custom level colors
----------------------------- */
winston.addColors({
  error: 'red',
  warn: 'yellow',
  info: 'cyan',
  http: 'magenta',
  debug: 'blue'
});

/* ----------------------------
   Console format (dev-friendly)
----------------------------- */
const consoleFormat = combine(
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  colorize({ all: true }),
  errors({ stack: true }),
  printf(({ timestamp, level, message, stack }) => {
    return `[${timestamp}] [${level}] ${stack || message}`;
  })
);

/* ----------------------------
   File format (prod / security)
----------------------------- */
const fileFormat = combine(timestamp(), errors({ stack: true }), json());

/* ----------------------------
   Logger factory
----------------------------- */
const createLogger = ({ name, file }) =>
  winston.loggers.add(name, {
    level: 'info',
    transports: [
      new winston.transports.Console({
        level: 'info',
        format: consoleFormat
      }),
      new winston.transports.File({
        filename: `logs/${file}.log`,
        level: 'info',
        format: fileFormat
      })
    ]
  });

/* ----------------------------
   Loggers
----------------------------- */
createLogger({ name: 'appLogger', file: 'app' });
createLogger({ name: 'authLogger', file: 'auth' });
createLogger({ name: 'submitLogger', file: 'submission' });
createLogger({ name: 'problemLogger', file: 'problem' });

/* ----------------------------
   Exports
----------------------------- */
export const appLogger = winston.loggers.get('appLogger');
export const authLogger = winston.loggers.get('authLogger');
export const submitLogger = winston.loggers.get('submitLogger');
export const problemLogger = winston.loggers.get('problemLogger');
