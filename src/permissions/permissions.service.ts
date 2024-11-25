import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from './permissions.entity';
import { Repository } from 'typeorm';
import { Tweet } from '../tweets/tweets.entity';
import { Group } from '../groups/groups.entity';
import { PermissionCreateRequestDto } from './dtos/requests.dto/permission.create.request.dto';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
    @InjectRepository(Tweet) private tweetRepository: Repository<Tweet>,
    @InjectRepository(Group) private groupRepository: Repository<Group>,
  ) {}

  /**
   *
   * @param number authorId
   * @param Tweet | null parentTweet
   * @param permissionData object
   * @returns Permission permission
   */
  async determinePermissionCreationStrategy(
    authorId: number,
    parentTweet: Tweet | null,
    permissionRequestData: PermissionCreateRequestDto,
  ): Promise<Permission> {
    // If There is Permission Request Data, Create a Custom Permission
    if (
      permissionRequestData &&
      Object.keys(permissionRequestData).length > 0
    ) {
      return await this.createCustomPermission(permissionRequestData);
    }
    // If there is a Parent Tweet, just Follow the Tweet Permission Strategy
    if (parentTweet) return null;

    // If There is no Parent Tweet, Create a Fallback Default Permission
    return await this.createFallbackPermission(authorId);
  }

  /**
   *
   * @param permissionData object
   * @returns Permission permission
   */
  private async createCustomPermission(
    permissionData: object,
  ): Promise<Permission> {
    const newPermission =
      await this.permissionRepository.create(permissionData);

    return await this.permissionRepository.save(newPermission);
  }

  /**
   *
   * @param number userId
   * @returns Permission permission
   */
  private async createFallbackPermission(userId: number): Promise<Permission> {
    const newPermission = await this.permissionRepository.create({
      publicViewPermission: true,
      usersViewPermissions: [userId],
      usersEditPermissions: [userId],
    });

    return await this.permissionRepository.save(newPermission);
  }
}
