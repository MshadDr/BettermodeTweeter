import { Injectable, NotFoundException } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { Group } from './groups.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/users.entity';
import { CreateGroupDto } from './dtos/resolvers.dto/create.groups.dto';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(Group) private groupRepository: Repository<Group>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async createGroup(createGroupDto: CreateGroupDto): Promise<Group> {
    const { userIds, parentGroupId, name } = createGroupDto;
    const users = await this.userRepository.find({
      where: {
        id: In(userIds),
      },
    });
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
