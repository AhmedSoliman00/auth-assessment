import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';

import configuration from './config/configuration';
import databaseConfig from './config/database.config';
import { envValidationSchema } from './config/env.validation';

import { DatabaseModule } from './common/database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration, databaseConfig],
      validationSchema: envValidationSchema,
    }),
    LoggerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const isDev = config.get<string>('NODE_ENV') !== 'production';
        return {
          pinoHttp: {
            transport: isDev
              ? { target: 'pino-pretty', options: { singleLine: true } }
              : undefined,
          },
        };
      },
    }),
    DatabaseModule,
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
