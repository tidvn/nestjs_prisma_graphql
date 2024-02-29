import { IsNotEmpty } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class RequestNonceInput {
  @Field()
  @IsNotEmpty()
  walletAddress: string;
}
