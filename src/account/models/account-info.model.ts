import 'reflect-metadata';
import {
  ObjectType,
  Field,
} from '@nestjs/graphql';
import { IsEmail } from 'class-validator';
import { AbstractModel } from 'src/common/models/abstract.model';

@ObjectType()
export class AccountInfo extends AbstractModel {
  @Field()
  @IsEmail()
  email: string;

  @Field(() => String, { nullable: true })
  firstname?: string;

  @Field(() => String, { nullable: true })
  lastname?: string;

  @Field(() => Boolean)
  isEmailVerified?: string;

  @Field(() => Boolean)
  isEnable?: string;
}
