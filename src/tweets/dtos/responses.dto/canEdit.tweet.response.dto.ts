import { Field, ObjectType } from '@nestjs/graphql';
import { baseResponseType } from '../../../base/responses/base.response.dto';
import { IsOptional } from 'class-validator';

@ObjectType()
export class CanEditTweetResponseDto extends baseResponseType(Boolean) {
  @Field(() => Boolean, { nullable: true, defaultValue: false })
  @IsOptional()
  data?: boolean;
}
