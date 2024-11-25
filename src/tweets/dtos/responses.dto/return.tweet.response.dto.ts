import { Field, ObjectType } from '@nestjs/graphql';
import { baseResponseType } from '../../../app/responses/base.response.dto';
import { Tweet } from '../../../tweets/tweets.entity';

@ObjectType()
export class ReturnTweetResponseDto extends baseResponseType(Tweet) {
  @Field(() => Tweet, { nullable: true })
  data?: Tweet;
}
