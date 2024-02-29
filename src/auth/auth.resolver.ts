import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { NonceResponse } from './models/nonce.model';
import { RequestNonceInput } from './dto/request-nonce.input';
import { Token } from './models/token.model';
import { LoginInput } from './dto/login.input';
import { RequestOTPInput } from './dto/request-otp.input';
@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => NonceResponse)
  async getNonce(
    @Args('data') data: RequestNonceInput,
  ): Promise<NonceResponse> {
    return await this.authService.getNonce(data);
  }

  @Mutation(() => Token)
  async login(@Args('data') data: LoginInput): Promise<Token> {
    return await this.authService.login(data);
  }

  @Mutation(() => Boolean)
  async requestEmailOTP(@Args('data') data: RequestOTPInput): Promise<boolean> {
    await this.authService.requestEmailOTP(data);
    return true;
  }
}
