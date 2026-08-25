import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    PinoLoggerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const isDev = config.get<string>('NODE_ENV') !== 'production';
        return {
          pinoHttp: {
            redact: [
              'req.headers.authorization',
              'req.headers.cookie',
              'req.body.password',
            ],
            serializers: {
              req(req: any) {
                return {
                  id: req.id,
                  method: req.method,
                  url: req.url,
                };
              },
              res(res: any) {
                return {
                  statusCode: res.statusCode,
                };
              },
            },
            transport: isDev
              ? {
                  target: 'pino-pretty',
                  options: {
                    colorize: true,
                    singleLine: true,
                    translateTime: 'SYS:yyyy-mm-dd HH:MM:ss',
                    ignore: 'pid,hostname',
                  },
                }
              : undefined,
          },
        };
      },
    }),
  ],
  exports: [PinoLoggerModule],
})
export class AppLoggerModule {}
