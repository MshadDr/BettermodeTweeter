import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Permission } from '../permissions/permissions.entity';
import { User } from '../users/users.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('tweets')
@ObjectType()
@Index(['author.id'])
@Index(['parentTweet.id'])
export class Tweet {
  save() {
    throw new Error('Method not implemented.');
  }
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column()
  @Field()
  content: string;

  @ManyToOne(() => User)
  @Field()
  author: User;

  @ManyToOne(() => Tweet)
  @Field({ nullable: true })
  parentTweet?: Tweet;

  @Column({ type: 'text', array: true, default: [] })
  @Field(() => [String], { defaultValue: [] })
  hashtag: string[];

  @Column({ nullable: true })
  @Field({ nullable: true })
  category?: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  location: string;

  @OneToOne(() => Permission, {
    cascade: true,
    eager: true,
  })
  @JoinColumn()
  @Field(() => Permission, { nullable: true })
  permission?: Permission;

  @Field({ defaultValue: false })
  @Column({ default: false })
  inheritViewPermissions: boolean;

  @Field({ defaultValue: false })
  @Column({ default: false })
  inheritEditPermissions: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
