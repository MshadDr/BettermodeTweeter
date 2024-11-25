import { Field, ObjectType } from '@nestjs/graphql';
import { baseResponseType } from '../../../app/responses/base.response.dto';

@ObjectType()
export class CanEditTweetResponseDto extends baseResponseType(Boolean) {
  @Field(() => Boolean, { nullable: true, defaultValue: false })
  data?: boolean;
}
