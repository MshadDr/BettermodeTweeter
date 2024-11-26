import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Group } from './groups.entity';
import { CreateGroupDto } from './dtos/resolvers.dto/create.groups.dto';
import { GroupService } from './groups.service';
import { HttpStatus, Inject } from '@nestjs/common';
import { ReturnGroupResponseDto } from './dtos/responses.dto/return.group.response.dto';

@Resolver(() => Group)
export class GroupResolver {
  constructor(@Inject(GroupService) private groupService: GroupService) {}

  /**
   * Create a new group
   * @param CreateGroupDto createGroupDto - The data for creating a new group
   * @returns ReturnGroupResponseDto - The response data for the created group
   */
  @Mutation(() => ReturnGroupResponseDto)
  async createGroup(
    @Args('createGroupsDto') createGrouopDto: CreateGroupDto,
  ): Promise<ReturnGroupResponseDto> {
    try {
      const group = await this.groupService.createGroup(createGrouopDto);
      return {
        statusCode: HttpStatus.CREATED,
        success: true,
        message: 'Group created successfully',
        data: group,
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
