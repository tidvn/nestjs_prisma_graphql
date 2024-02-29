import { PrismaService } from 'nestjs-prisma';
import { accountSession } from '@prisma/client';
import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { isNil } from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { NonceResponse } from './models/nonce.model';
import { LoginInput } from './dto/login.input';
import { verifyMessage } from 'src/utils/verify-signature.util';
import { AccountInfo } from 'src/account/models/account-info.model';
import { Token } from './models/token.model';
import { RequestOTPInput } from './dto/request-otp.input';
import { MailSenderService } from 'src/mail-sender/mail-sender.service';
import { RegisterInput } from './dto/register.input';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly mailSenderService: MailSenderService,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}

  async getNonce(walletAddress: string): Promise<NonceResponse> {
    const accountWallet = await this.prisma.accountWallet.findUnique({
      where: { id: walletAddress },
    });
    let nonce: string = await this.cacheManager.get(`nonce-${walletAddress}`);

    if (isNil(nonce)) {
      nonce = uuidv4();
      await this.cacheManager.set(
        `nonce-${walletAddress}`,
        nonce,
        this.configService.get<number>('auth.ttl.wallet_nonce'),
      );
    }

    return {
      walletAddress: walletAddress,
      nonce: nonce,
      isRegistered: !isNil(accountWallet),
    };
  }

  async login(payload: LoginInput): Promise<Token> {
    const { blockchain, walletAddress, signature } = payload;
    const nonce: string = await this.cacheManager.get(`nonce-${walletAddress}`);
    const verified = verifyMessage(blockchain, nonce, signature, walletAddress);

    if (!verified) {
      throw new BadRequestException('Cannot verify wallet signature');
    }

    const accountInfo = await this.prisma.accountInfo.findFirst({
      where: {
        accountWallets: {
          some: {
            walletAddress: walletAddress,
          },
        },
      },
    });
    if (isNil(accountInfo)) {
      throw new UnauthorizedException();
    }
    const accountSession = await this.saveAccountSession(accountInfo);
    await this.cacheManager.del(`nonce-${walletAddress}`);

    return this.generateTokens(accountInfo, accountSession);
  }

  async requestEmailOTP(payload: RequestOTPInput) {
    const { walletAddress, email } = payload;

    const existingAccountWallet = await this.prisma.accountWallet.findFirst({
      where: {
        walletAddress: walletAddress,
      },
    });

    if (existingAccountWallet) {
      throw new UnauthorizedException('Wallet was registered.');
    }

    // Check if the email is already used by another account
    const existingAccountInfo = await this.prisma.accountInfo.findFirst({
      where: {
        email: email,
        isEmailVerified: true,
      },
    });

    if (existingAccountInfo) {
      throw new BadRequestException('Email already used by another account.');
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP to cache
    await this.cacheManager.set(
      `email-otp-${walletAddress}-${email}`,
      otp,
      this.configService.get<number>('auth.ttl.email_otp'),
    );

    await this.mailSenderService.sendVerifyEmailMail(email, otp);

    return true;
  }

  async register(payload: RegisterInput): Promise<Token> {
    const { walletAddress, email, signature, blockchain } = payload;

    const otp: string = await this.cacheManager.get(
      `email-otp-${walletAddress}-${email}`,
    );

    if (isNil(otp)) {
      throw new BadRequestException('OTP is expired or invalid.');
    }

    const verified = verifyMessage(blockchain, otp, signature, walletAddress);

    if (!verified) {
      throw new BadRequestException('Cannot verify signature');
    }

    await this.cacheManager.del(`email-otp-${walletAddress}-${email}`);

    const accountInfo = await this.prisma.accountInfo.findFirst({
      where: {
        email: email,
        isEmailVerified: true,
      },
    });

    if (accountInfo) {
      throw new BadRequestException('Email already used by another account.');
    }

    const accountWallet = await this.prisma.accountWallet.findFirst({
      where: {
        walletAddress: walletAddress,
      },
    });

    if (accountWallet) {
      throw new BadRequestException('Wallet already registered.');
    }

    const newAccountInfo = await this.prisma.accountInfo.create({
      data: {
        email: email,
        isEmailVerified: true,
        firstname: '',
        lastname: '',
        isEnable: true,
      },
    });

    await this.prisma.accountWallet.create({
      data: {
        walletAddress: walletAddress,
        accountId: newAccountInfo.id,
        blockchain: blockchain,
      },
    });

    const newSession = await this.saveAccountSession(newAccountInfo);
    await this.cacheManager.del(`nonce-${walletAddress}`);

    return this.generateTokens(newAccountInfo, newSession);
  }

  async logout(account: AccountInfo) {
    const accountSession = await this.prisma.accountSession.findFirst({
      where: {
        accountId: account.id,
      },
    });
    if (!isNil(accountSession)) {
      await this.prisma.accountSession.delete({
        where: {
          id: accountSession.id,
        },
      });
    }
  }

  async refreshToken(refreshToken: string): Promise<Token> {
    const decoded = this.jwtService.verify(refreshToken, {
      secret: this.configService.get<string>('auth.jwt.refresh_secret'),
    });

    if (isNil(decoded) || isNil(decoded.session_id) || isNil(decoded.sub)) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const accountSession = await this.prisma.accountSession.findFirst({
      where: {
        id: decoded.session_id,
      },
    });

    if (isNil(accountSession)) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const account = await this.prisma.accountInfo.findFirst({
      where: {
        id: decoded.sub,
      },
    });

    if (isNil(account)) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    return this.generateTokens(account, accountSession);
  }

  private async saveAccountSession(
    account: AccountInfo,
  ): Promise<accountSession> {
    let accountSession = await this.prisma.accountSession.findFirst({
      where: {
        accountId: account.id,
      },
    });

    if (!accountSession) {
      accountSession = await this.prisma.accountSession.create({
        data: {
          accountId: account.id,
        },
      });
    }

    return accountSession;
  }

  private generateTokens(account: AccountInfo, session: accountSession): any {
    //TODO [accessToken, refreshToken] = await Promise.all(signAsync)

    const accessToken = this.jwtService.sign(
      { sub: account.id, email: account.email, session_id: session.id },
      {
        secret: this.configService.get<string>('auth.jwt.access_secret'),
        expiresIn: this.configService.get<string>('auth.jwt.access_expires_in'),
      },
    );

    const refreshToken = this.jwtService.sign(
      { sub: account.id, session_id: session.id },
      {
        secret: this.configService.get<string>('auth.jwt.refresh_secret'),
        expiresIn: this.configService.get<string>(
          'auth.jwt.refresh_expires_in',
        ),
      },
    );

    return { accessToken: accessToken, refreshToken: refreshToken };
  }
}
