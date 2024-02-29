import { IsNotEmpty } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';
import { Blockchain } from '@prisma/client';

@InputType()
export class LoginInput {
  @Field()
  @IsNotEmpty()
  blockchain: Blockchain;

  @Field()
  @IsNotEmpty()
  walletAddress: string;

  @Field()
  @IsNotEmpty()
  signature: string;
}
