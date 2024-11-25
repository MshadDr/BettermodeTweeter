import { Test, TestingModule } from '@nestjs/testing';
import { GroupResolver } from './groups.resolver';
import { GroupService } from './groups.service';
import { CreateGroupDto } from './dtos/resolvers.dto/create.groups.dto';
import { HttpStatus } from '@nestjs/common';
import { Group } from './groups.entity';

describe('GroupResolver', () => {
  let resolver: GroupResolver;
  let groupService: GroupService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GroupResolver,
        {
          provide: GroupService,
          useValue: {
            createGroup: jest.fn(),
          },
        },
      ],
    }).compile();

    resolver = module.get<GroupResolver>(GroupResolver);
    groupService = module.get<GroupService>(GroupService);
  });

  describe('createGroup', () => {
    it('should create a new group and return it', async () => {
      const createGroupDto: CreateGroupDto = {
        name: 'Test Group',
        userIds: [],
      };

      const createdGroup: Group = {
        id: 1,
        name: 'Test Group',
        users: [],
        created_at: new Date(),
        updated_at: new Date(),
      };

      jest.spyOn(groupService, 'createGroup').mockResolvedValue(createdGroup);

      const result = await resolver.createGroup(createGroupDto);

      expect(result.statusCode).toBe(HttpStatus.CREATED);
      expect(result.success).toBe(true);
      expect(result.message).toBe('Group created successfully');
      expect(result.data).toEqual(createdGroup);
    });
  });
});
