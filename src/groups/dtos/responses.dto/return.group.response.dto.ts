import { Field, ObjectType } from '@nestjs/graphql';
import { Group } from '../../groups.entity';
import { baseResponseType } from '../../../base/responses/base.response.dto';
import { IsOptional } from 'class-validator';

@ObjectType()
export class ReturnGroupResponseDto extends baseResponseType(Group) {
  @Field(() => Group, { nullable: true })
  @IsOptional()
  data?: Group;
}
