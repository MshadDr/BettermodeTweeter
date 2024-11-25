import { Field, InputType, Int } from '@nestjs/graphql';
import { IsArray, IsBoolean, IsNumber, IsOptional } from 'class-validator';

@InputType()
export class UpdateTweetPermissionDto {
  @Field(() => Int)
  @IsNumber()
  tweetId: number;

  @Field(() => Int)
  @IsNumber()
  userId: number;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  inheritViewPermissions?: boolean;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  inheritEditPermissions?: boolean;

  //================permission=========================
  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  publicViewPermission?: boolean;

  @Field(() => [Int], { nullable: true })
  @IsArray()
  @IsOptional()
  @IsNumber({}, { each: true })
  addUsersViewPermissions?: number[];

  @Field(() => [Int], { nullable: true })
  @IsArray()
  @IsOptional()
  @IsNumber({}, { each: true })
  addGroupsViewPermissions?: number[];

  @Field(() => [Int], { nullable: true })
  @IsArray()
  @IsOptional()
  @IsNumber({}, { each: true })
  addUsersEditPermissions?: number[];

  @Field(() => [Int], { nullable: true })
  @IsArray()
  @IsOptional()
  @IsNumber({}, { each: true })
  addGroupEditPermissions?: number[];

  @Field(() => [Int], { nullable: true })
  @IsArray()
  @IsOptional()
  @IsNumber({}, { each: true })
  removeUsersViewPermissions?: number[];

  @Field(() => [Int], { nullable: true })
  @IsArray()
  @IsOptional()
  @IsNumber({}, { each: true })
  removeGroupsViewPermissions?: number[];

  @Field(() => [Int], { nullable: true })
  @IsArray()
  @IsOptional()
  @IsNumber({}, { each: true })
  removeUsersEditPermissions?: number[];

  @Field(() => [Int], { nullable: true })
  @IsArray()
  @IsOptional()
  @IsNumber({}, { each: true })
  removeGroupEditPermissions?: number[];
}
