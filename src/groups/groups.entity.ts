import { Field, Int, ObjectType } from '@nestjs/graphql';
import { User } from '../users/users.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

@Entity('groups')
@ObjectType()
export class Group {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column()
  @Field()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ManyToMany(() => User, (user) => user.groups)
  @JoinTable()
  @Field(() => [User])
  users: User[];

  @ManyToOne(() => Group, (group) => group.subgroups, { nullable: true })
  @Field(() => Group, { nullable: true })
  @IsOptional()
  parentgroup?: Group;

  @OneToMany(() => Group, (group) => group.parentgroup, { nullable: true })
  @Field(() => [Group], { nullable: true })
  @IsOptional()
  subgroups?: Group[];

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
