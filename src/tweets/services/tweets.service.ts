import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Raw, Repository } from 'typeorm';
import { Tweet } from '../tweets.entity';
import { TweetCreateRequestDto } from '../dtos/requests.dto/tweet.create.request.dto';
import { PermissionsService } from '../../permissions/permissions.service';
import { FilterTweetDto } from '../dtos/requests.dto/tweet.filter.request.dto';
import { Throttle } from '@nestjs/throttler';
import { GroupService } from '../../groups/groups.service';
import { UsersService } from '../../users/users.service';

@Injectable()
export class TweetsService {
  private readonly logger = new Logger(TweetsService.name);

  constructor(
    @InjectRepository(Tweet) private tweetRepository: Repository<Tweet>,
    private readonly userService: UsersService,
    private readonly groupService: GroupService,
    private readonly permissionsService: PermissionsService,
    private readonly dataSource: DataSource,
  ) {}

  /**
   *
   * @param number userId
   * @param number page
   * @param number limit
   * @returns Promise<{ tweets: Tweet[]; total: number; pages: number }>
   */
  async paginateTweets(
    userId: number,
    page?: number,
    limit?: number,
    filterTweetDto?: FilterTweetDto,
  ): Promise<{
    data: Tweet[];
    total: number;
    pages: number;
    hasNextPage: boolean;
  }> {
    const userGroupsIds = await this.groupService.getUserGroupsIds(userId);
    const skip = (page - 1) * limit;

    // Prepare Where Conditions based on user permissions
    const whereConditions = [
      { author: { id: userId } },
      {
        permission: {
          usersViewPermissions: Raw((alias) => `${alias} @> ARRAY[${userId}]`),
        },
      },
      {
        permission: {
          groupsViewPermissions:
            userGroupsIds.length > 0
              ? Raw((alias) => `${alias} && ARRAY[${userGroupsIds.join(',')}]`)
              : null,
        },
      },
      { permission: { publicViewPermission: true } },
    ];

    // Prepare Filters for Tweets Based on the Request
    const filterConditions = filterTweetDto
      ? this.filterConditions(filterTweetDto)
      : [];

    // Fetch Tweets and Total Count to Paginate Results
    const [tweets, total] = await this.tweetRepository.findAndCount({
      where: [
        ...whereConditions.map((condition) => ({
          ...condition,
          ...(filterConditions.length > 0 ? filterConditions[0] : {}),
        })),
      ],
      relations: ['author', 'permission'],
      order: {
        created_at: 'DESC',
      },
      skip,
      take: limit,
    });

    const pages = Math.ceil(total / limit);
    const hasNextPage = page < pages;

    return {
      data: tweets,
      total,
      pages,
      hasNextPage,
    };
  }

  /**
   *
   * @param filterTweetDto
   * @returns any[]
   */
  private filterConditions(filterTweetDto: FilterTweetDto): any[] {
    return [
      filterTweetDto.authorId && { author: { id: filterTweetDto.authorId } },
      filterTweetDto.parentTweetId && {
        parentTweet: { id: filterTweetDto.parentTweetId },
      },
      filterTweetDto.category && { category: filterTweetDto.category },
      filterTweetDto.location && { location: filterTweetDto.location },
      filterTweetDto.hashtag && {
        hashtags: Raw(
          (alias) => `${alias} @> ARRAY['${filterTweetDto.hashtag}']`,
        ),
      },
    ].filter(Boolean);
  }

  /**
   *
   * @param TweetCreateRequestDto tweetCreateRequestDto
   * @returns Tweet
   */
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  async createTweet(
    tweetCreateRequestDto: TweetCreateRequestDto,
  ): Promise<Tweet> {
    try {
      return await this.dataSource.transaction(
        async (transactionalEntityManager) => {
          const { parentId, authorId } = tweetCreateRequestDto;

          // Parallel fetch of author and parent tweet
          const [author, parentTweet] = await Promise.all([
            this.userService.findUserById(authorId),
            parentId
              ? this.getTweetWithRelations(parentId)
              : Promise.resolve(null),
          ]);

          // Validation checks
          if (!author) {
            throw new NotFoundException(`Author with ID ${authorId} not found`);
          }
          if (parentId && !parentTweet) {
            throw new NotFoundException(
              `Parent tweet with ID ${parentId} not found`,
            );
          }

          // Prepare permission data with default values
          const {
            publicViewPermission = true,
            usersViewPermissions = [authorId],
            usersEditPermissions = [authorId],
            groupEditPermissions = [],
            groupViewPermissions = [],
          } = tweetCreateRequestDto;

          // Create permission
          const createdPermission =
            await this.permissionsService.determinePermissionCreationStrategy(
              authorId,
              parentTweet,
              {
                publicViewPermission,
                usersViewPermissions,
                usersEditPermissions,
                groupEditPermissions,
                groupViewPermissions,
              },
            );

          // Save tweet with all relations in a single operation
          const tweet = await transactionalEntityManager.save(Tweet, {
            ...tweetCreateRequestDto,
            author,
            parentTweet,
            permission: createdPermission,
            inheritViewPermissions: !createdPermission,
            inheritEditPermissions: !createdPermission,
          });

          return await transactionalEntityManager.findOne(Tweet, {
            where: { id: tweet.id },
            relations: ['permission', 'parentTweet', 'author'],
          });
        },
      );
    } catch (error) {
      this.logger.error(
        `Failed to create tweet: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   *
   * @param number tweetId
   * @returns Tweet
   */
  private async getTweetWithRelations(tweetId: number): Promise<Tweet> {
    return await this.tweetRepository.findOne({
      where: { id: tweetId },
      relations: ['permission', 'parentTweet', 'author'],
    });
  }
}
