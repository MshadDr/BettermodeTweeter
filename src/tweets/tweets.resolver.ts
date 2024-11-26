import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { TweetsService } from './services/tweets.service';
import { Tweet } from './tweets.entity';
import { TweetCreateRequestDto } from './dtos/requests.dto/tweet.create.request.dto';
import { UpdateTweetPermissionDto } from './dtos/requests.dto/tweet.update.permission.request.dto';
import { CanEditTweetResponseDto } from './dtos/responses.dto/canEdit.tweet.response.dto';
import { ReturnTweetResponseDto } from './dtos/responses.dto/return.tweet.response.dto';
import { HttpStatus } from '@nestjs/common';
import { TweetPermissionService } from './services/tweet-permission.service';
import { ReturnPaginateTweetsResponseDto } from './dtos/responses.dto/return.paginate.tweets.response.dto';
import { FilterTweetDto } from './dtos/requests.dto/tweet.filter.request.dto';

@Resolver(() => Tweet)
export class TweetsResolver {
  constructor(
    private tweetsService: TweetsService,
    private tweetPermissionService: TweetPermissionService,
  ) {}

  @Query(() => ReturnPaginateTweetsResponseDto)
  async paginateTweets(
    @Args('userId', { type: () => Int }) userId: number,
    @Args('page', { type: () => Int, defaultValue: 1 }) page?: number,
    @Args('limit', { type: () => Int, defaultValue: 10 }) limit?: number,
    @Args('filterTweetDto', { nullable: true }) filterTweetDto?: FilterTweetDto,
  ): Promise<ReturnPaginateTweetsResponseDto> {
    try {
      const { data, total, pages, hasNextPage } =
        await this.tweetsService.paginateTweets(
          userId,
          page,
          limit,
          filterTweetDto,
        );

      return {
        statusCode: HttpStatus.OK,
        success: true,
        message: 'Request is successful',
        data,
        total,
        pages,
        hasNextPage,
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        success: false,
        message: error.message,
        stack: process.env.NODE_ENV === 'production' ? null : error.stack,
      };
    }
  }

  /**
   *
   * @param number userId
   * @param number tweetId
   * @returns CanEditTweetResponseDto
   */
  @Query(() => CanEditTweetResponseDto)
  async canEditTweet(
    @Args('userId', { type: () => Int }) userId: number,
    @Args('tweetId', { type: () => Int }) tweetId: number,
  ): Promise<CanEditTweetResponseDto> {
    try {
      const result = await this.tweetPermissionService.canEditTweet(
        userId,
        tweetId,
      );

      return {
        statusCode: HttpStatus.OK,
        success: true,
        message: 'Request is successful',
        data: result,
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        success: false,
        message:
          process.env.NODE_ENV === 'production'
            ? 'An error occurred while processing your request'
            : error.message,
        stack: process.env.NODE_ENV === 'production' ? null : error.stack,
      };
    }
  }

  /**
   *
   * @param TweetCreateRequestDto tweetCreateRequestDto
   * @returns ReturnTweetResponseDto returnTweetResponseDto
   */
  @Mutation(() => ReturnTweetResponseDto)
  async createTweet(
    @Args('tweetCreateRequestDto') tweetCreateRequestDto: TweetCreateRequestDto,
  ): Promise<ReturnTweetResponseDto> {
    try {
      const tweet = await this.tweetsService.createTweet(tweetCreateRequestDto);

      return {
        statusCode: HttpStatus.CREATED,
        success: true,
        message: 'Request is successful',
        data: tweet,
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        success: false,
        message:
          process.env.NODE_ENV === 'production'
            ? 'An error occurred while processing your request'
            : error.message,
        stack: process.env.NODE_ENV === 'production' ? null : error.stack,
      };
    }
  }

  /**
   *
   * @param updateTweetPermissionDto
   * @returns
   */
  @Mutation(() => ReturnTweetResponseDto)
  async updateTweetaPermission(
    @Args('updateTweetPermissionDto')
    updateTweetPermissionDto: UpdateTweetPermissionDto,
  ): Promise<ReturnTweetResponseDto> {
    try {
      const tweet = await this.tweetPermissionService.updateTweetPermission(
        updateTweetPermissionDto,
      );

      return {
        statusCode: HttpStatus.OK,
        success: true,
        message: 'Request is successful',
        data: tweet,
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        success: false,
        message:
          process.env.NODE_ENV === 'production'
            ? 'An error occurred while processing your request'
            : error.message,
        stack: process.env.NODE_ENV === 'production' ? null : error.stack,
      };
    }
  }
}
