import { Field, ObjectType } from '@nestjs/graphql';
import { baseResponseType } from '../../../base/responses/base.response.dto';
import { Tweet } from '../../../tweets/tweets.entity';
import { IsOptional } from 'class-validator';

@ObjectType()
export class ReturnTweetResponseDto extends baseResponseType(Tweet) {
  @Field(() => Tweet, { nullable: true })
  @IsOptional()
  data?: Tweet;
}
