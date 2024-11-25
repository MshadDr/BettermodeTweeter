import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';
import { User } from '../users/users.entity';
import { Tweet } from '../tweets/tweets.entity';
import { Permission } from '../permissions/permissions.entity';
import { Group } from '../groups/groups.entity';
import * as dotenv from 'dotenv';

dotenv.config();

const options: DataSourceOptions & SeederOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME,
  entities: [User, Group, Permission, Tweet],
  synchronize: true,
  seeds: ['src/database/seeds/*.seed.ts'],
};

export const AppDataSource = new DataSource(options);
