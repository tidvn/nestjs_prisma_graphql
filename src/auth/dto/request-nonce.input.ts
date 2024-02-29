import { IsNotEmpty } from 'class-validator';
import { Field, ArgsType } from '@nestjs/graphql';

@ArgsType()
export class RequestNonceInput {
  @Field()
  @IsNotEmpty()
  walletAddress: string;
}
