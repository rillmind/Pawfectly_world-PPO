import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { JwtStrategy } from './jwt/jwt.strategy';
import { UserSchema } from './schemas/user.schemas';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({ inject: [ConfigService], useFactory: (config: ConfigService) => {
        return { secret: config.get<string>('JWT_SECRET'), signOptions: { expiresIn: config.get<string | number>('JWT_EXPIRES') } } } }),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
  ],
  controllers: [UserController],
  providers: [UserService, JwtStrategy],
  exports: [JwtStrategy, PassportModule],
})
export class UserModule {}
