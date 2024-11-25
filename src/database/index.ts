import { Group } from '../groups/groups.entity';
import { User } from '../users/users.entity';
import { DataSource, DataSourceOptions } from 'typeorm';
import { runSeeders } from 'typeorm-extension';
import * as dotenv from 'dotenv';
import GroupSeeder from './seeds/group.seed';
import UserSeeder from './seeds/users.seed';

dotenv.config();

const options: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [User, Group],
  synchronize: false,
};

const dataSource = new DataSource(options);

async function main() {
  try {
    await dataSource.initialize();
    await runSeeders(dataSource, {
      seeds: [UserSeeder, GroupSeeder],
      factories: [],
    });
    console.log('Seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  } finally {
    await dataSource.destroy();
  }
}

main();
