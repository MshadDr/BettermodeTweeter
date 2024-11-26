import { Test, TestingModule } from '@nestjs/testing';
import { TweetPermissionService } from './tweet-permission.service';
import { Tweet } from '../tweets.entity';
import { Group } from '../../groups/groups.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { UpdateTweetPermissionDto } from '../dtos/requests.dto/tweet.update.permission.request.dto';
import { Permission } from '../../permissions/permissions.entity';
import { User } from '../../users/users.entity';
import { TweetCategoriesEnum } from '../enums/tweets.categories.enum';
import { GroupService } from '../../groups/groups.service';
import { UsersService } from '../../users/users.service';

describe('TweetPermissionService', () => {
  let service: TweetPermissionService;
  let tweetRepository: Repository<Tweet>;
  let groupRepository: Repository<Group>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TweetPermissionService,
        {
          provide: getRepositoryToken(Tweet),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Group),
          useValue: {
            find: jest.fn(),
          },
        },
        {
          provide: GroupService,
          useValue: {
            findOne: jest.fn(),
            getUserGroupsIds: jest.fn().mockResolvedValue([1]),
          },
        },
        {
          provide: UsersService,
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TweetPermissionService>(TweetPermissionService);
    tweetRepository = module.get<Repository<Tweet>>(getRepositoryToken(Tweet));
    groupRepository = module.get<Repository<Group>>(getRepositoryToken(Group));
  });

  describe('canEditTweet', () => {
    it('should throw NotFoundException if tweet is not found', async () => {
      const tweetId = 1;
      const userId = 1;

      jest.spyOn(tweetRepository, 'findOne').mockResolvedValue(null);

      await expect(service.canEditTweet(userId, tweetId)).rejects.toThrow(
        new NotFoundException('Tweet not found'),
      );
    });

    it('should return true if user is the author', async () => {
      const tweet = {
        id: 1,
        author: { id: 1 },
        permission: {
          usersEditPermissions: [],
          groupEditPermissions: [],
        },
        parentTweet: null,
        inheritEditPermissions: false,
      } as Tweet;

      jest.spyOn(tweetRepository, 'findOne').mockResolvedValue(tweet);
      jest.spyOn(groupRepository, 'find').mockResolvedValue([
        {
          id: 1,
          name: 'Test Group',
          users: [],
          created_at: new Date(),
          updated_at: new Date(),
        },
      ]);

      const result = await service.canEditTweet(1, 1);
      expect(result).toBe(true);
    });

    it('should return true if user has direct edit permissions', async () => {
      const tweet = {
        id: 1,
        author: { id: 2 },
        permission: {
          usersEditPermissions: [1],
          groupEditPermissions: [],
        },
        parentTweet: null,
        inheritEditPermissions: false,
      } as Tweet;

      jest.spyOn(tweetRepository, 'findOne').mockResolvedValue(tweet);
      jest.spyOn(groupRepository, 'find').mockResolvedValue([
        {
          id: 1,
          name: 'Test Group',
          users: [],
          created_at: new Date(),
          updated_at: new Date(),
        },
      ]);

      const result = await service.canEditTweet(1, 1);
      expect(result).toBe(true);
    });

    it('should return true if user has inherited edit permissions', async () => {
      const tweet = {
        id: 1,
        author: { id: 2 },
        permission: {
          usersEditPermissions: [],
          groupEditPermissions: [],
        },
        parentTweet: {
          permission: {
            usersEditPermissions: [1],
          },
        },
        inheritEditPermissions: true,
      } as Tweet;

      jest.spyOn(tweetRepository, 'findOne').mockResolvedValue(tweet);
      jest.spyOn(groupRepository, 'find').mockResolvedValue([
        {
          id: 1,
          name: 'Test Group',
          users: [],
          created_at: new Date(),
          updated_at: new Date(),
        },
      ]);

      const result = await service.canEditTweet(1, 1);
      expect(result).toBe(true);
    });

    it('should return true if user has group edit permissions', async () => {
      const tweet = {
        id: 1,
        author: { id: 2 },
        permission: {
          usersEditPermissions: [],
          groupEditPermissions: [1],
        },
        parentTweet: null,
        inheritEditPermissions: false,
      } as Tweet;

      jest.spyOn(tweetRepository, 'findOne').mockResolvedValue(tweet);
      jest.spyOn(groupRepository, 'find').mockResolvedValue([
        {
          id: 1,
          name: 'Test Group',
          users: [],
          created_at: new Date(),
          updated_at: new Date(),
        },
      ]);

      const result = await service.canEditTweet(1, 1);
      expect(result).toBe(true);
    });

    it('should throw ForbiddenException if user has no permissions', async () => {
      const tweet = {
        id: 1,
        author: { id: 2 },
        permission: {
          usersEditPermissions: [],
          groupEditPermissions: [],
        },
        parentTweet: null,
        inheritEditPermissions: false,
      } as Tweet;

      jest.spyOn(tweetRepository, 'findOne').mockResolvedValue(tweet);
      jest.spyOn(groupRepository, 'find').mockResolvedValue([
        {
          id: 1,
          name: 'Test Group',
          users: [],
          created_at: new Date(),
          updated_at: new Date(),
        },
      ]);

      await expect(service.canEditTweet(1, 1)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('updateTweetPermission', () => {
    it('should throw NotFoundException if tweet is not found', async () => {
      const updateTweetPermissionDto: UpdateTweetPermissionDto = {
        userId: 1,
        tweetId: 1,
      };

      jest.spyOn(tweetRepository, 'findOne').mockResolvedValue(null);

      await expect(
        service.updateTweetPermission(updateTweetPermissionDto),
      ).rejects.toThrow(new NotFoundException('Tweet not Found!'));
    });

    it('should throw ForbiddenException if user does not have permission to update the tweet', async () => {
      const tweet: Tweet = {
        id: 1,
        content: 'Test content',
        author: { id: 2 } as User,
        permission: { usersEditPermissions: [] } as Permission,
        inheritViewPermissions: false,
        inheritEditPermissions: false,
        created_at: new Date(),
        updated_at: new Date(),
        hashtag: [],
        location: '',
        category: TweetCategoriesEnum.NEWS,
        parentTweet: null,
        save: jest.fn(),
      } as Tweet;

      const updateTweetPermissionDto: UpdateTweetPermissionDto = {
        userId: 1,
        tweetId: 1,
      };

      jest.spyOn(tweetRepository, 'findOne').mockResolvedValue(tweet);
      jest.spyOn(groupRepository, 'find').mockResolvedValue([]);

      await expect(
        service.updateTweetPermission(updateTweetPermissionDto),
      ).rejects.toThrow(
        new ForbiddenException(
          "User doesn't have permission to update this tweet!",
        ),
      );
    });

    it('should successfully update all permission types', async () => {
      const tweet = {
        id: 1,
        author: { id: 1 },
        permission: {
          usersEditPermissions: [1],
          groupEditPermissions: [1],
          usersViewPermissions: [1],
          groupsViewPermissions: [1],
          publicViewPermission: false,
        },
        inheritEditPermissions: false,
        inheritViewPermissions: false,
      } as Tweet;

      const updateDto: UpdateTweetPermissionDto = {
        userId: 1,
        tweetId: 1,
        inheritViewPermissions: true,
        inheritEditPermissions: true,
        publicViewPermission: true,
        addUsersEditPermissions: [2],
        addGroupEditPermissions: [2],
        addUsersViewPermissions: [2],
        addGroupsViewPermissions: [2],
        removeUsersEditPermissions: [1],
        removeGroupEditPermissions: [1],
        removeUsersViewPermissions: [1],
        removeGroupsViewPermissions: [1],
      };

      jest.spyOn(tweetRepository, 'findOne').mockResolvedValueOnce(tweet);
      jest.spyOn(groupRepository, 'find').mockResolvedValue([
        {
          id: 1,
          name: 'Test Group',
          users: [],
          created_at: new Date(),
          updated_at: new Date(),
        },
      ]);
      jest.spyOn(tweetRepository, 'save').mockResolvedValue({
        ...tweet,
        inheritViewPermissions: updateDto.inheritViewPermissions,
        inheritEditPermissions: updateDto.inheritEditPermissions,
        permission: {
          ...tweet.permission,
          publicViewPermission: updateDto.publicViewPermission,
          usersEditPermissions: [2],
          groupEditPermissions: [2],
          usersViewPermissions: [2],
          groupsViewPermissions: [2],
        },
        save: jest.fn(),
      } as Tweet);

      await service.updateTweetPermission(updateDto);

      expect(tweetRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          inheritViewPermissions: true,
          inheritEditPermissions: true,
          permission: expect.objectContaining({
            publicViewPermission: true,
            usersEditPermissions: [2],
            groupEditPermissions: [2],
            usersViewPermissions: [2],
            groupsViewPermissions: [2],
          }),
        }),
      );
    });
  });
});
