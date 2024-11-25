import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Group } from '../groups/groups.entity';
import { Permission } from '../permissions/permissions.entity';
import { Tweet } from '../tweets/tweets.entity';
import { User } from '../users/users.entity';

export const dbConnectionConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  const isDevelopmentEnv = configService.get<string>('NODE_ENV') === 'dev';

  return {
    type: 'postgres',
    host: configService.get<string>('DB_HOST'),
    port: configService.get<number>('DB_PORT'),
    username: configService.get<string>('DB_USERNAME'),
    password: configService.get<string>('DB_PASSWORD'),
    database: configService.get<string>('DB_NAME'),
    entities: [User, Permission, Group, Tweet],
    synchronize: isDevelopmentEnv,
    migrationsRun: !isDevelopmentEnv,
    logging: configService.get<boolean>('DB_LOGGING'),
    migrations: ['src/migrations/*.ts'],
  };
};
