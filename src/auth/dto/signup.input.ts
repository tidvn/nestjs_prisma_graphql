import { IsNotEmpty } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';
import { RequestOTPInput } from './request-otp.input';
import { Blockchain } from '@prisma/client';

@InputType()
export class SignupInput extends RequestOTPInput {
  @Field()
  @IsNotEmpty()
  blockchain: Blockchain;

  @Field()
  @IsNotEmpty()
  signature: string;
}
