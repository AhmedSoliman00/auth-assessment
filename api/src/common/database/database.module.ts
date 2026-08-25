import { Module, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('database.uri'),
        connectionFactory: (connection: Connection) => {
          const logger = new Logger('Database');
          if (connection.readyState === 1) {
            logger.log('MongoDB connected successfully');
          }
          connection.on('connected', () => {
            logger.log('MongoDB connected successfully');
          });
          connection.on('error', (err: unknown) => {
            const errorMsg = err instanceof Error ? err.message : String(err);
            logger.error(`MongoDB connection failed: ${errorMsg}`);
          });
          connection.on('disconnected', () => {
            logger.warn('MongoDB disconnected');
          });
          return connection;
        },
      }),
    }),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule {}
