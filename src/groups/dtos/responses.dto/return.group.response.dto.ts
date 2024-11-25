import { Field, ObjectType } from '@nestjs/graphql';
import { Group } from '../../groups.entity';
import { baseResponseType } from '../../../app/responses/base.response.dto';

@ObjectType()
export class ReturnGroupResponseDto extends baseResponseType(Group) {
  @Field(() => Group)
  data?: Group;
}
