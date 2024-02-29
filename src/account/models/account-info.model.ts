import 'reflect-metadata';
import { ObjectType, Field } from '@nestjs/graphql';
import { IsEmail } from 'class-validator';
import { BaseModel } from 'src/common/models/base.model';

@ObjectType()
export class AccountInfo extends BaseModel {
  @Field()
  @IsEmail()
  email: string;

  @Field(() => String, { nullable: true })
  firstname?: string;

  @Field(() => String, { nullable: true })
  lastname?: string;

  @Field(() => Boolean)
  isEmailVerified?: boolean;

  @Field(() => Boolean)
  isEnable?: boolean;

  @Field(() => String, { nullable: true })
  sessionId?: string;
}
