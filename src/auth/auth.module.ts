import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { CacheModule } from '@nestjs/cache-manager';
import { AccessTokenStrategy } from './auth.strategy';
import { MailSenderModule } from 'src/mail-sender/mail-sender.module';

@Module({
  imports: [
    CacheModule.register(),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({}),
    MailSenderModule,
  ],
  providers: [AuthService, AuthResolver, AccessTokenStrategy],
  exports: [],
})
export class AuthModule {}
