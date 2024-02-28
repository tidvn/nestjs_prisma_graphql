import { IsNotEmpty } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class LoginInput {
  @Field()
  @IsNotEmpty()
  walletAddress: string;

  @Field()
  @IsNotEmpty()
  signature: string;
}
