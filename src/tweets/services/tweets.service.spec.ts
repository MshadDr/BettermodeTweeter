import { Test, TestingModule } from '@nestjs/testing';
import { TweetsService } from './tweets.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Tweet } from '../tweets.entity';
import { User } from '../../users/users.entity';
import { Group } from '../../groups/groups.entity';
import { DataSource } from 'typeorm';
import { PermissionsService } from '../../permissions/permissions.service';
import { NotFoundException } from '@nestjs/common';
import { TweetCategoriesEnum } from '../enums/tweets.categories.enum';

describe('TweetsService', () => {
  let service: TweetsService;
  let mockTweetRepository;
  let mockUserRepository;
  let mockGroupRepository;
  let mockPermissionsService;
  let mockDataSource;

  beforeEach(async () => {
    mockTweetRepository = {
      findOne: jest.fn(),
      save: jest.fn(),
    };

    mockUserRepository = {
      findOne: jest.fn(),
    };

    mockGroupRepository = {
      find: jest.fn(),
    };

    mockPermissionsService = {
      determinePermissionCreationStrategy: jest.fn(),
    };

    mockDataSource = {
      transaction: jest.fn((callback) =>
        callback({
          save: jest.fn().mockResolvedValue({ id: 1, content: 'Test tweet' }),
          findOne: jest.fn().mockResolvedValue({
            id: 1,
            content: 'Test tweet',
            author: { id: 1, name: 'Test User' },
            permission: { id: 1 },
          }),
        }),
      ),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TweetsService,
        {
          provide: getRepositoryToken(Tweet),
          useValue: mockTweetRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: getRepositoryToken(Group),
          useValue: mockGroupRepository,
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
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createTweet', () => {
    it('should successfully create a tweet', async () => {
      const mockUser = { id: 1, name: 'Test User' };
      const mockPermission = { id: 1 };
      const mockTweet = {
        id: 1,
        content: 'Test tweet',
        author: mockUser,
        permission: mockPermission,
      };

      const createTweetDto = {
        content: 'Test tweet',
        authorId: 1,
        category: [TweetCategoriesEnum.FINANCE],
        publicViewPermission: true,
        usersViewPermissions: [1],
        usersEditPermissions: [1],
        groupEditPermissions: [],
        groupViewPermissions: [],
        hashtags: [],
      };

      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockPermissionsService.determinePermissionCreationStrategy.mockResolvedValue(
        mockPermission,
      );
      mockTweetRepository.findOne.mockResolvedValue(mockTweet);
      mockDataSource.transaction.mockImplementation(async (cb) => {
        return cb({
          save: jest.fn().mockResolvedValue(mockTweet),
          findOne: jest.fn().mockResolvedValue(mockTweet),
        });
      });

      const result = await service.createTweet(createTweetDto);

      expect(result).toEqual(mockTweet);
      expect(mockUserRepository.findOne).toHaveBeenCalled();
      expect(
        mockPermissionsService.determinePermissionCreationStrategy,
      ).toHaveBeenCalled();
    });

    it('should throw NotFoundException when author is not found', async () => {
      const createTweetDto = {
        content: 'Test tweet',
        authorId: 999,
        category: [TweetCategoriesEnum.FINANCE],
        publicViewPermission: true,
        usersViewPermissions: [],
        usersEditPermissions: [],
        groupEditPermissions: [],
        groupViewPermissions: [],
        hashtags: [],
      };

      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.createTweet(createTweetDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
