import { Query, Resolver } from '@nestjs/graphql';
import { baseResponseType } from './responses/base.response.dto';
import { ObjectType } from '@nestjs/graphql';
import { HttpStatus } from '@nestjs/common';

@ObjectType()
class HealthCheckResponse extends baseResponseType(Boolean) {}

@Resolver()
export class AppResolver {
  @Query(() => HealthCheckResponse)
  healthCheck(): HealthCheckResponse {
    return {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'health is ok...',
      data: null,
    };
  }
}
