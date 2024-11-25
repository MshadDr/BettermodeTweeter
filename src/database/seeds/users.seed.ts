import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { User } from '../../users/users.entity';

function generateMockUsers(count: number): Partial<User>[] {
  const firstNames = [
    'John',
    'Jane',
    'Bob',
    'Alice',
    'Michael',
    'Sarah',
    'David',
    'Emma',
    'James',
    'Olivia',
    'William',
    'Sophia',
    'Lucas',
    'Mia',
    'Ethan',
    'Ava',
    'Noah',
    'Isabella',
    'Mason',
    'Charlotte',
  ];
  const lastNames = [
    'Smith',
    'Johnson',
    'Williams',
    'Brown',
    'Jones',
    'Garcia',
    'Miller',
    'Davis',
    'Wilson',
    'Taylor',
    'Anderson',
    'Thomas',
    'White',
    'Harris',
    'Martin',
    'Thompson',
    'Moore',
    'Martinez',
    'Robinson',
    'Clark',
  ];

  return Array.from({ length: count }, () => {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    return {
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
    };
  });
}

export default class UserSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const userRepository = dataSource.getRepository(User);

    const existingUsers = await userRepository.count();
    if (existingUsers > 0) {
      console.log('Users table already has data, skipping seed');
      return;
    }

    const mockUsers = generateMockUsers(20);
    await userRepository.save(mockUsers);
    console.log('Users seeded successfully');
  }
}
