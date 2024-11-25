import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tweet } from '../tweets.entity';
import { Repository } from 'typeorm';
import { Group } from '../../groups/groups.entity';
import { UpdateTweetPermissionDto } from '../dtos/requests.dto/tweet.update.permission.request.dto';

@Injectable()
export class TweetPermissionService {
  constructor(
    @InjectRepository(Tweet) private tweetRepository: Repository<Tweet>,
    @InjectRepository(Group) private groupRepository: Repository<Group>,
  ) {}

  /**
   *
   * @param userId
   * @param tweetId
   * @returns
   */
  async canEditTweet(userId: number, tweetId: number): Promise<boolean> {
    const tweet = await this.tweetRepository.findOne({
      where: { id: tweetId },
      relations: ['author'],
    });

    if (!tweet) throw new NotFoundException('Tweet not found');

    if (
      (tweet.author?.id === userId ||
        tweet.permission?.usersEditPermissions?.includes(userId)) ??
      false
    )
      return true;

    // Check Permission Center
    return await this.checkPermission(userId, tweet);
  }

  /**
   *
   * @param updateTweetPermissionDto
   * @returns
   */
  async updateTweetPermission(
    updateTweetPermissionDto: UpdateTweetPermissionDto,
  ): Promise<Tweet> {
    let newTweet: Tweet = null;
    const { userId, tweetId } = updateTweetPermissionDto;

    const tweet = await this.tweetRepository.findOne({
      where: { id: tweetId },
      relations: ['permission', 'author', 'parentTweet'],
    });
    if (!tweet) throw new NotFoundException('Tweet not Found!');

    // Check Permission Center
    if (await this.checkPermission(userId, tweet)) {
      newTweet = await this.updatePermission(updateTweetPermissionDto, tweet);
    } else {
      throw new ForbiddenException(
        "User doesn't have permission to update this tweet!",
      );
    }

    return newTweet;
  }

  /**
   *
   * @param number userId
   * @param Tweet tweet
   * @returns boolean
   */
  private async checkPermission(
    userId: number,
    tweet: Tweet,
  ): Promise<boolean> {
    const userGroups = await this.groupRepository.find({
      where: { users: { id: userId } },
      select: {
        id: true,
      },
    });

    const userGroupsIds = userGroups.map((group) => group.id);

    if (
      tweet.author.id === userId ||
      tweet.permission.usersEditPermissions.includes(userId) ||
      (tweet.inheritEditPermissions &&
        tweet.parentTweet.permission.usersEditPermissions.includes(userId)) ||
      (userGroupsIds.length > 0 &&
        userGroupsIds.some(
          (id) => tweet.permission?.groupEditPermissions?.includes(id) ?? false,
        ))
    ) {
      return true;
    } else {
      throw new ForbiddenException(
        "User doesn't have permission to update this tweet!",
      );
    }
  }

  /**
   *
   * @param UpdateTweetPermissionDto updateTweetPermissionDto
   * @param Tweet tweet
   * @returns Tweet
   */
  private async updatePermission(
    updateTweetPermissionDto: UpdateTweetPermissionDto,
    tweet: Tweet,
  ): Promise<Tweet> {
    const {
      inheritViewPermissions,
      inheritEditPermissions,
      publicViewPermission,
      addUsersEditPermissions,
      addUsersViewPermissions,
      addGroupEditPermissions,
      addGroupsViewPermissions,
      removeUsersEditPermissions,
      removeUsersViewPermissions,
      removeGroupEditPermissions,
      removeGroupsViewPermissions,
    } = updateTweetPermissionDto;

    if (inheritViewPermissions !== undefined)
      tweet.inheritViewPermissions = inheritViewPermissions;
    if (inheritEditPermissions !== undefined)
      tweet.inheritEditPermissions = inheritEditPermissions;
    if (publicViewPermission !== undefined)
      tweet.permission.publicViewPermission = publicViewPermission;

    if (addUsersEditPermissions)
      tweet.permission.usersEditPermissions = [
        ...addUsersEditPermissions,
        ...tweet.permission.usersEditPermissions,
      ];

    if (addGroupEditPermissions)
      tweet.permission.groupEditPermissions = [
        ...addGroupEditPermissions,
        ...tweet.permission.groupEditPermissions,
      ];

    if (addUsersViewPermissions)
      tweet.permission.usersViewPermissions = [
        ...addUsersViewPermissions,
        ...tweet.permission.usersViewPermissions,
      ];

    if (addGroupsViewPermissions)
      tweet.permission.groupsViewPermissions = [
        ...addGroupsViewPermissions,
        ...tweet.permission.groupsViewPermissions,
      ];

    if (removeUsersEditPermissions)
      tweet.permission.usersEditPermissions =
        tweet.permission.usersEditPermissions.filter(
          (id) => !removeUsersEditPermissions.includes(id),
        );

    if (removeGroupEditPermissions)
      tweet.permission.groupEditPermissions =
        tweet.permission.groupEditPermissions.filter(
          (id) => !removeGroupEditPermissions.includes(id),
        );

    if (removeUsersViewPermissions)
      tweet.permission.usersViewPermissions =
        tweet.permission.usersViewPermissions.filter(
          (id) => !removeUsersViewPermissions.includes(id),
        );

    if (removeGroupsViewPermissions)
      tweet.permission.groupsViewPermissions =
        tweet.permission.groupsViewPermissions.filter(
          (id) => !removeGroupsViewPermissions.includes(id),
        );

    const updatedTweet = await this.tweetRepository.save(tweet);
    return this.tweetRepository.findOne({
      where: { id: updatedTweet.id },
      relations: ['permission', 'parentTweet', 'author'],
    });
  }
}
