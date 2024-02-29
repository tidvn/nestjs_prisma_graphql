import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class NonceResponse {
  @Field()
  walletAddress: string;

  @Field()
  nonce: string;

  @Field()
  isRegistered: boolean;
}
