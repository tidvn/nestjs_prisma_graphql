import { IsEmail, IsNotEmpty } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class RequestOTPInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsNotEmpty()
  walletAddress: string;
}
