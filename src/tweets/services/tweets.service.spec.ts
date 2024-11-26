import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { TweetsService } from '../services/tweets.service';
import { Tweet } from '../tweets.entity';
import { UsersService } from '../../users/users.service';
import { GroupService } from '../../groups/groups.service';
import { PermissionsService } from '../../permissions/permissions.service';
import { NotFoundException } from '@nestjs/common';

describe('TweetsService', () => {
  let service: TweetsService;
  let userService: UsersService;
  let tweetRepository: Repository<Tweet>;

  const mockTweetRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
  };

  const mockUserService = {
    findUserById: jest.fn(),
  };

  const mockGroupService = {
    getUserGroupsIds: jest.fn(),
  };

  const mockPermissionsService = {
    determinePermissionCreationStrategy: jest.fn(),
  };

  const mockDataSource = {
    transaction: jest.fn((cb) =>
      cb({
        save: jest.fn(),
        findOne: jest.fn(),
      }),
    ),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TweetsService,
        {
          provide: getRepositoryToken(Tweet),
          useValue: mockTweetRepository,
        },
        {
          provide: UsersService,
          useValue: mockUserService,
        },
        {
          provide: GroupService,
          useValue: mockGroupService,
        },
        {
          provide: PermissionsService,
          useValue: mockPermissionsService,
        },
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
      ],
    }).compile();

    service = module.get<TweetsService>(TweetsService);
    userService = module.get<UsersService>(UsersService);
    tweetRepository = module.get<Repository<Tweet>>(getRepositoryToken(Tweet));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createTweet', () => {
    it('should create a tweet successfully', async () => {
      const mockUser = { id: 1, name: 'Test User' };
      const mockTweetDto = {
        authorId: 1,
        content: 'Test tweet',
        publicViewPermission: true,
        hashtags: [],
        usersViewPermissions: [],
        usersEditPermissions: [],
      };
      const mockPermission = { id: 1 };
      const mockCreatedTweet = {
        id: 1,
        content: 'Test tweet',
        author: mockUser,
        permission: mockPermission,
      };

      mockUserService.findUserById.mockResolvedValue(mockUser);
      mockPermissionsService.determinePermissionCreationStrategy.mockResolvedValue(
        mockPermission,
      );

      mockDataSource.transaction.mockImplementationOnce(async (cb) => {
        return await cb({
          save: jest.fn().mockResolvedValue(mockCreatedTweet),
          findOne: jest.fn().mockResolvedValue(mockCreatedTweet),
        });
      });

      const result = await service.createTweet(mockTweetDto);

      expect(result).toEqual(mockCreatedTweet);
      expect(mockUserService.findUserById).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when author not found', async () => {
      const mockTweetDto = {
        authorId: 999,
        content: 'Test tweet',
        publicViewPermission: true,
        hashtags: [],
        usersViewPermissions: [],
        usersEditPermissions: [],
      };

      mockUserService.findUserById.mockResolvedValue(null);

      await expect(service.createTweet(mockTweetDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
