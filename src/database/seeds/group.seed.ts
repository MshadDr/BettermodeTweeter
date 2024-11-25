import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { Group } from '../../groups/groups.entity';
import { User } from '../../users/users.entity';

export default class GroupSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const groupRepository = dataSource.getRepository(Group);
    const userRepository = dataSource.getRepository(User);

    const existingGroups = await groupRepository.count();
    if (existingGroups > 0) {
      console.log('Groups table already has data, skipping seed');
      return;
    }

    const users = await userRepository.find();
    if (users.length === 0) {
      console.log('No users found. Please run user seeder first.');
      return;
    }

    const parentGroups = await groupRepository.save([
      {
        name: 'Engineering',
        users: users.slice(0, 5),
      },
      {
        name: 'Marketing',
        users: users.slice(5, 10),
      },
      {
        name: 'Sales',
        users: users.slice(10, 15),
      },
    ]);

    const subGroups = [];
    for (const parentGroup of parentGroups) {
      const subGroupsData = [
        {
          name: `${parentGroup.name} - Team A`,
          users: users.slice(0, 3),
          parentgroup: parentGroup,
        },
        {
          name: `${parentGroup.name} - Team B`,
          users: users.slice(3, 6),
          parentgroup: parentGroup,
        },
      ];
      subGroups.push(...subGroupsData);
    }

    await groupRepository.save(subGroups);
    console.log('Groups seeded successfully');
  }
}
