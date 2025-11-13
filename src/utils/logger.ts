import logger from 'pino';
import dayjs from 'dayjs';
import  config  from 'config';

const isDev = config.get('MODE') === 'dev';

const log = logger({
  enabled: isDev,                                // <--- key line
  base: { pid: false },
  timestamp: () => `,"time":"${dayjs().format()}"`,
  transport: isDev
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:standard',
          ignore: 'pid,hostname',
        },
      }
    : undefined, // no pretty printing in production
});

export default log;
