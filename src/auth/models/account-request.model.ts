import { Field, ObjectType } from '@nestjs/graphql';
import { IsEmail } from 'class-validator';
import { AccountInfo } from 'src/account/models/account-info.model';

@ObjectType()
export class AccountRequest extends AccountInfo {
  @Field()
  @IsEmail()
  sessionId: string;
}
