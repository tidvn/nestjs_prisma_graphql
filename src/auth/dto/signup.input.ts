import { IsNotEmpty } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';
import { RequestOTPInput } from './request-otp.input';

@InputType()
export class SignupInput extends RequestOTPInput {
  @Field()
  @IsNotEmpty()
  signature: string;
}
