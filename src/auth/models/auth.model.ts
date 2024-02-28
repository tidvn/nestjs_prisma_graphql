import { ObjectType } from '@nestjs/graphql';
import { Token } from './token.model';
import { AccountInfo } from 'src/account/models/account-info.model';

@ObjectType()
export class Auth extends Token {
  accountInfo: AccountInfo;
}
