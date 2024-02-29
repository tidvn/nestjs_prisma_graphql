import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { NonceResponse } from './models/nonce.model';
import { RequestNonceInput } from './dto/request-nonce.input';
import { Token } from './models/token.model';
import { LoginInput } from './dto/login.input';
import { RequestOTPInput } from './dto/request-otp.input';
import { RegisterInput } from './dto/register.input';
import { UseGuards } from '@nestjs/common';
import { GraphqlAuthGuard } from './graphql-auth.guard';
import { AccountEntity } from 'src/common/decorators/account.decorator';
import { StatusResponse } from './models/status.model';
import { RefreshTokenInput } from './dto/refresh-token.input';
import { AccountRequest } from './models/account-request.model';
@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => NonceResponse)
  async getNonce(
    @Args() { walletAddress }: RequestNonceInput,
  ): Promise<NonceResponse> {
    return await this.authService.getNonce(walletAddress);
  }

  @Mutation(() => Token)
  async login(@Args('input') input: LoginInput): Promise<Token> {
    return await this.authService.login(input);
  }

  @Mutation(() => StatusResponse)
  async requestEmailOTP(
    @Args('input') input: RequestOTPInput,
  ): Promise<StatusResponse> {
    await this.authService.requestEmailOTP(input);
    return { success: true, message: 'OTP sent to your email' };
  }

  @Mutation(() => Token)
  async register(@Args('input') input: RegisterInput): Promise<Token> {
    return await this.authService.register(input);
  }

  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => StatusResponse)
  async logout(
    @AccountEntity() account: AccountRequest,
  ): Promise<StatusResponse> {
    await this.authService.logout(account);
    return { success: true, message: 'Logout successfully' };
  }

  @Mutation(() => Token)
  async refreshToken(@Args() { token }: RefreshTokenInput): Promise<Token> {
    return await this.authService.refreshToken(token);
  }
}
