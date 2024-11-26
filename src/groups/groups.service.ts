import { Injectable, NotFoundException } from '@nestjs/common';
import { Group } from './groups.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateGroupDto } from './dtos/resolvers.dto/create.groups.dto';
import { UsersService } from '../users/users.service';
import { Repository } from 'typeorm';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(Group) private groupRepository: Repository<Group>,
    private readonly userService: UsersService,
  ) {}

  /**
   *
   * @param number userId
   * @returns number[] groupsIds
   */
  async getUserGroupsIds(userId: number): Promise<number[]> {
    const groups = await this.groupRepository.find({
      where: { users: { id: userId } },
      select: {
        id: true,
      },
    });

    const groupsIds = groups.map((group) => group.id);
    return groupsIds;
  }

  /**
   *
   * @param CreateGroupDto createGroupDto
   * @returns Group group
   */
  async createGroup(createGroupDto: CreateGroupDto): Promise<Group> {
    const { userIds, parentGroupId, name } = createGroupDto;
    const users = await this.userService.findUsersByIds(userIds);
    if (users.length !== createGroupDto.userIds.length) {
      throw new Error('Some users do not exist');
    }
    const newGroup = await this.groupRepository.create({
      name: name,
      users,
    });

    if (parentGroupId) {
      const parentGroup = await this.groupRepository
        .findOneByOrFail({
          id: parentGroupId,
        })
        .catch(() => {
          throw new NotFoundException(
            `Parent group with ID ${parentGroupId} not found`,
          );
        });

      newGroup.parentgroup = parentGroup;
    }

    await this.groupRepository.save(newGroup);
    const savedGroup = await this.groupRepository.findOne({
      where: { id: newGroup.id },
      relations: ['users', 'parentgroup', 'subgroups'],
    });

    return savedGroup;
  }
}
