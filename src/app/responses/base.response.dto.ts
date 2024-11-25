import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Type } from '@nestjs/common';

export function baseResponseType<T>(TClass: Type<T>) {
  @ObjectType({ isAbstract: true })
  class BaseResponseDtoClass {
    @Field(() => Int)
    statusCode: number;

    @Field(() => Boolean)
    success: boolean;

    @Field(() => String)
    message: string;

    @Field(() => [TClass], { nullable: true })
    data?: T | T[];

    @Field(() => String, { nullable: true })
    stack?: string;
  }
  return BaseResponseDtoClass;
}
