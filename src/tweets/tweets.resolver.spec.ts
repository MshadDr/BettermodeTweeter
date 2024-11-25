import { Test, TestingModule } from '@nestjs/testing';
import { TweetsResolver } from './tweets.resolver';
import { TweetPermissionService } from './services/tweet-permission.service';
import { HttpStatus } from '@nestjs/common';
import { Tweet } from './tweets.entity';
import { TweetCreateRequestDto } from './dtos/requests.dto/tweet.create.request.dto';
import { UpdateTweetPermissionDto } from './dtos/requests.dto/tweet.update.permission.request.dto';
import { TweetsService } from './services/tweets.service';

describe('TweetsResolver', () => {
  let resolver: TweetsResolver;
  let tweetsService: TweetsService;
  let tweetPermissionService: TweetPermissionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TweetsResolver,
        {
          provide: TweetsService,
          useValue: {
            paginateTweets: jest.fn(),
            createTweet: jest.fn(),
          },
        },
        {
          provide: TweetPermissionService,
          useValue: {
            canEditTweet: jest.fn(),
            updateTweetPermission: jest.fn(),
          },
        },
      ],
    }).compile();

    resolver = module.get<TweetsResolver>(TweetsResolver);
    tweetsService = module.get<TweetsService>(TweetsService);
    tweetPermissionService = module.get<TweetPermissionService>(
      TweetPermissionService,
    );
  });

  describe('paginateTweets', () => {
    it('should return a paginated list of tweets', async () => {
      const userId = 1;
      const page = 1;
      const limit = 10;
      const tweetData = {
        data: [new Tweet()],
        total: 10,
        pages: 1,
        hasNextPage: false,
      };

      jest.spyOn(tweetsService, 'paginateTweets').mockResolvedValue(tweetData);

      const result = await resolver.paginateTweets(userId, page, limit);

      expect(result.statusCode).toBe(HttpStatus.OK);
      expect(result.success).toBe(true);
      expect(result.data.length).toBe(1);
      expect(result.total).toBe(10);
      expect(result.pages).toBe(1);
    });
  });

  describe('canEditTweet', () => {
    it('should return whether the user can edit the tweet', async () => {
      const userId = 1;
      const tweetId = 1;
      const canEditResponse = true;

      jest
        .spyOn(tweetPermissionService, 'canEditTweet')
        .mockResolvedValue(canEditResponse);

      const result = await resolver.canEditTweet(userId, tweetId);

      expect(result.statusCode).toBe(HttpStatus.OK);
      expect(result.success).toBe(true);
      expect(result.data).toBe(canEditResponse);
    });
  });

  describe('createTweet', () => {
    it('should create a new tweet and return it', async () => {
      const tweetCreateRequestDto: TweetCreateRequestDto = {
        content: 'Test tweet',
        authorId: 1,
        hashtags: [],
        usersViewPermissions: [],
        publicViewPermission: true,
        usersEditPermissions: [],
      };
      const createdTweet = new Tweet();
      createdTweet.id = 1;
      createdTweet.content = 'Test tweet';
      createdTweet.author = { id: 1 } as any;

      jest.spyOn(tweetsService, 'createTweet').mockResolvedValue(createdTweet);

      const result = await resolver.createTweet(tweetCreateRequestDto);

      expect(result.statusCode).toBe(HttpStatus.CREATED);
      expect(result.success).toBe(true);
      expect(result.data).toEqual(createdTweet);
    });
  });

  describe('updateTweetPermission', () => {
    it('should update tweet permissions and return the updated tweet', async () => {
      const updateTweetPermissionDto: UpdateTweetPermissionDto = {
        userId: 1,
        tweetId: 1,
        addUsersEditPermissions: [2],
      };
      const updatedTweet = new Tweet();
      updatedTweet.id = 1;
      updatedTweet.content = 'Updated tweet';
      updatedTweet.author = { id: 1 } as any;
      updatedTweet.permission = {
        usersEditPermissions: [1, 2],
        groupEditPermissions: [],
        publicViewPermission: true,
      } as any;

      jest
        .spyOn(tweetPermissionService, 'updateTweetPermission')
        .mockResolvedValue(updatedTweet);

      const result = await resolver.updateTweetaPermission(
        updateTweetPermissionDto,
      );

      expect(result.statusCode).toBe(HttpStatus.OK);
      expect(result.success).toBe(true);
      expect(result.data).toEqual(updatedTweet);
    });
  });
});
