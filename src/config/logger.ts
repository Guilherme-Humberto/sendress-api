import winston from 'winston'

const logger = winston.createLogger({
    transports: [
      new winston.transports.File({
        filename: 'logs.log'
      }),
      new winston.transports.Console()
    ]
});

export { logger }