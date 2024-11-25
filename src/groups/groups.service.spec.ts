import { Test, TestingModule } from '@nestjs/testing';
import { GroupService } from './groups.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Group } from './groups.entity';
import { User } from '../users/users.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { CreateGroupDto } from './dtos/resolvers.dto/create.groups.dto';

describe('GroupService', () => {
  let service: GroupService;
  let groupRepository: Repository<Group>;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GroupService,
        {
          provide: getRepositoryToken(Group),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<GroupService>(GroupService);
    groupRepository = module.get<Repository<Group>>(getRepositoryToken(Group));
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  describe('createGroup', () => {
    it('should successfully create a group with valid users and parent group', async () => {
      const createGroupDto: CreateGroupDto = {
        name: 'Test Group',
        userIds: [1, 2],
        parentGroupId: null,
      };

      const users = [
        {
          id: 1,
          email: 'user1@example.com',
          groups: [],
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 2,
          email: 'user2@example.com',
          groups: [],
          created_at: new Date(),
          updated_at: new Date(),
        },
      ] as User[];

      const newGroup = {
        id: 1,
        name: 'Test Group',
        users: users,
        parentgroup: null,
      } as Group;

      jest.spyOn(userRepository, 'find').mockResolvedValue(users);
      jest.spyOn(groupRepository, 'create').mockReturnValue(newGroup as any);
      jest.spyOn(groupRepository, 'save').mockResolvedValue(newGroup as any);
      jest.spyOn(groupRepository, 'findOne').mockResolvedValue(newGroup as any);

      const result = await service.createGroup(createGroupDto);

      expect(result).toEqual(newGroup);
      expect(groupRepository.findOne).toHaveBeenCalledWith({
        where: { id: newGroup.id },
        relations: ['users', 'parentgroup', 'subgroups'],
      });
    });

    it('should throw an error if some users do not exist', async () => {
      const createGroupDto: CreateGroupDto = {
        name: 'Test Group',
        userIds: [1, 3],
        parentGroupId: null,
      };

      const users = [
        {
          id: 1,
          email: 'user1@example.com',
          groups: [],
          created_at: new Date(),
          updated_at: new Date(),
        },
      ];

      jest.spyOn(userRepository, 'find').mockResolvedValue(users);

      await expect(service.createGroup(createGroupDto)).rejects.toThrowError(
        'Some users do not exist',
      );
    });

    it('should throw a NotFoundException if the parent group does not exist', async () => {
      const createGroupDto: CreateGroupDto = {
        name: 'Test Group',
        userIds: [1],
        parentGroupId: 999,
      };

      const users = [
        {
          id: 1,
          email: 'user1@example.com',
          groups: [],
          created_at: new Date(),
          updated_at: new Date(),
        },
      ];

      jest.spyOn(userRepository, 'find').mockResolvedValue(users);
      jest.spyOn(groupRepository, 'findOneBy').mockResolvedValue(null);
      jest.spyOn(groupRepository, 'create').mockReturnValue({} as Group);

      await expect(service.createGroup(createGroupDto)).rejects.toThrowError(
        new NotFoundException('Parent group with ID 999 not found'),
      );
    });
  });
});
