import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { GroupService } from './groups.service';
import { Group } from './groups.entity';
import { UsersService } from '../users/users.service';
import { Repository } from 'typeorm';

describe('GroupService', () => {
  let service: GroupService;
  let groupRepository: Repository<Group>;
  let usersService: UsersService;

  const mockGroupRepository = {
    find: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    findOneByOrFail: jest.fn(),
  };

  const mockUsersService = {
    findUsersByIds: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GroupService,
        {
          provide: getRepositoryToken(Group),
          useValue: mockGroupRepository,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    service = module.get<GroupService>(GroupService);
    groupRepository = module.get<Repository<Group>>(getRepositoryToken(Group));
    usersService = module.get<UsersService>(UsersService);
  });

  describe('getUserGroupsIds', () => {
    it('should return array of group ids for a user', async () => {
      const mockGroups = [{ id: 1 }, { id: 2 }];
      mockGroupRepository.find.mockResolvedValue(mockGroups);

      const result = await service.getUserGroupsIds(1);
      expect(result).toEqual([1, 2]);
    });
  });

  describe('createGroup', () => {
    it('should create a new group successfully', async () => {
      const createGroupDto = {
        name: 'Test Group',
        userIds: [1, 2],
        parentGroupId: null,
      };

      const mockUsers = [{ id: 1 }, { id: 2 }];
      const mockNewGroup = { id: 1, name: 'Test Group', users: mockUsers };

      mockUsersService.findUsersByIds.mockResolvedValue(mockUsers);
      mockGroupRepository.create.mockReturnValue(mockNewGroup);
      mockGroupRepository.save.mockResolvedValue(mockNewGroup);
      mockGroupRepository.findOne.mockResolvedValue(mockNewGroup);

      const result = await service.createGroup(createGroupDto);

      expect(result).toEqual(mockNewGroup);
    });
  });
});
